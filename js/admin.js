/*
 * ============================================================
 * BOLETIM CARIOCA
 * PAINEL ADMINISTRATIVO / EDITORIAL
 *
 * Funções:
 * - autenticação
 * - dashboard
 * - notícias
 * - editor de notícias
 * - categorias
 * - perfil
 * - usuários (superadmin)
 *
 * Segurança:
 * O JavaScript NÃO substitui RLS.
 * Todas as operações dependem das policies do Supabase.
 * ============================================================
 */


/* ============================================================
   CONFIGURAÇÃO SUPABASE
   ============================================================ */

const SUPABASE_URL =
    "https://pnzfvqigcqeoiqiwymzo.supabase.co";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuemZ2cWlnY3Flb2lxaXd5bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMTE2NTQsImV4cCI6MjEwMTg4NzY1NH0.4CyQ8Tq00AWJ9eUSbr5Z1kWnqIVwd1k8ooPXEN3uzZU";


/* ============================================================
   CLIENTE
   ============================================================ */

if (
    !window.supabase ||
    typeof window.supabase.createClient !== "function"
) {

    console.error(
        "Supabase JS não foi carregado."
    );

} else {

    window.supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );

}


document.addEventListener(
    "DOMContentLoaded",
    async () => {


        /* ====================================================
           GARANTIA SUPABASE
           ==================================================== */

        if (!window.supabaseClient) {

            console.error(
                "supabaseClient não foi inicializado."
            );

            document.body.innerHTML = `
                <div style="
                    padding:40px;
                    font-family:Arial,sans-serif;
                ">
                    <h1>Erro de configuração</h1>
                    <p>
                        O cliente Supabase não foi inicializado.
                    </p>
                </div>
            `;

            return;
        }


        const supabaseClient =
            window.supabaseClient;


        /* ====================================================
           ESTADO
           ==================================================== */

        let currentUser = null;

        let currentProfile = null;

        let allArticles = [];

        let allProfiles = [];

        let allCategories = [];

        let editingArticleId = null;


        /* ====================================================
           ELEMENTOS
           ==================================================== */

        const $ = (id) =>
            document.getElementById(id);


        const elements = {

            sidebar:
                $("adminSidebar"),

            mobileMenuButton:
                $("mobileMenuButton"),

            pageTitle:
                $("pageTitle"),

            headerUserName:
                $("headerUserName"),

            headerUserRole:
                $("headerUserRole"),

            logoutButton:
                $("logoutButton"),

            globalMessage:
                $("globalMessage"),

            dashboardGreeting:
                $("dashboardGreeting"),

            statTotal:
                $("statTotal"),

            statDrafts:
                $("statDrafts"),

            statPublished:
                $("statPublished"),

            statArchived:
                $("statArchived"),

            recentArticles:
                $("recentArticles"),

            dashboardRoleBadge:
                $("dashboardRoleBadge"),

            dashboardRoleDescription:
                $("dashboardRoleDescription"),

            articlesDescription:
                $("articlesDescription"),

            articleStatusFilter:
                $("articleStatusFilter"),

            articleAuthorFilter:
                $("articleAuthorFilter"),

            articleAuthorFilterWrap:
                $("articleAuthorFilterWrap"),

            refreshArticlesButton:
                $("refreshArticlesButton"),

            adminArticlesTableBody:
                $("adminArticlesTableBody"),

            articleForm:
                $("articleForm"),

            articleFormTitle:
                $("articleFormTitle"),

            editingArticleId:
                $("editingArticleId"),

            articleTitle:
                $("articleTitle"),

            articleSubtitle:
                $("articleSubtitle"),

            articleSlug:
                $("articleSlug"),

            articleExcerpt:
                $("articleExcerpt"),

            articleContent:
                $("articleContent"),

            articleImageUrl:
                $("articleImageUrl"),

            articleImageAlt:
                $("articleImageAlt"),

            articleImageCaption:
                $("articleImageCaption"),

            articleCategory:
                $("articleCategory"),

            articleStatus:
                $("articleStatus"),

            articlePublishInfo:
                $("articlePublishInfo"),

            articleAuthorDisplay:
                $("articleAuthorDisplay"),

            cancelArticleButton:
                $("cancelArticleButton"),

            categoryForm:
                $("categoryForm"),

            categoryName:
                $("categoryName"),

            categorySlug:
                $("categorySlug"),

            categoryDescription:
                $("categoryDescription"),

            categoriesList:
                $("categoriesList"),

            usersNavItem:
                $("usersNavItem"),

            refreshUsersButton:
                $("refreshUsersButton"),

            usersTableBody:
                $("usersTableBody"),

            profileInitial:
                $("profileInitial"),

            profileDisplayName:
                $("profileDisplayName"),

            profileEmail:
                $("profileEmail"),

            profileRole:
                $("profileRole"),

            profileForm:
                $("profileForm"),

            profileNameInput:
                $("profileNameInput"),

            profileAvatarInput:
                $("profileAvatarInput"),

            confirmationModal:
                $("confirmationModal"),

            confirmationClose:
                $("confirmationClose"),

            confirmationTitle:
                $("confirmationTitle"),

            confirmationMessage:
                $("confirmationMessage"),

            confirmationCancel:
                $("confirmationCancel"),

            confirmationConfirm:
                $("confirmationConfirm")

        };


        /* ====================================================
           VALIDAR ELEMENTOS
           ==================================================== */

        const missing =
            Object.entries(elements)
                .filter(
                    ([, value]) =>
                        !value
                )
                .map(
                    ([key]) =>
                        key
                );


        if (missing.length) {

            console.error(
                "ELEMENTOS AUSENTES NO PAINEL:",
                missing
            );

            return;
        }


        /* ====================================================
           UTILITÁRIOS
           ==================================================== */

        function escapeHtml(value) {

            return String(
                value ?? ""
            )
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                '"',
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );

        }


        function slugify(text) {

            return String(
                text || ""
            )
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .trim()
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                "");

        }


        function formatDate(value) {

            if (!value) {
                return "—";
            }

            return new Date(
                value
            ).toLocaleDateString(
                "pt-BR",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            );

        }


        function roleLabel(role) {

            const labels = {

                user:
                    "Usuário",

                journalist:
                    "Jornalista",

                editor:
                    "Editor",

                superadmin:
                    "Superadmin"

            };

            return (
                labels[role] ||
                role ||
                "—"
            );

        }


        function statusLabel(status) {

            const labels = {

                draft:
                    "Rascunho",

                published:
                    "Publicado",

                archived:
                    "Arquivado"

            };

            return (
                labels[status] ||
                status ||
                "—"
            );

        }


        function showMessage(
            message,
            isError = false
        ) {

            elements.globalMessage.textContent =
                message;

            elements.globalMessage.classList.add(
                "visible"
            );

            elements.globalMessage.classList.toggle(
                "error",
                isError
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }


        function hideMessage() {

            elements.globalMessage.textContent =
                "";

            elements.globalMessage.classList.remove(
                "visible",
                "error"
            );

        }


        function isEditorOrAbove() {

            return [
                "editor",
                "superadmin"
            ].includes(
                currentProfile?.role
            );

        }


        function isSuperadmin() {

            return (
                currentProfile?.role ===
                "superadmin"
            );

        }


        /* ====================================================
           AUTENTICAÇÃO
           ==================================================== */

        async function loadCurrentUser() {

            const {
                data,
                error
            } =
                await supabaseClient.auth.getUser();


            if (error) {

                console.error(
                    "ERRO AUTH:",
                    error
                );

                return false;
            }


            if (!data?.user) {

                return false;
            }


            currentUser =
                data.user;


            const {
                data: profile,
                error: profileError
            } =
                await supabaseClient
                    .from("profiles")
                    .select(
                        `
                        id,
                        display_name,
                        avatar_url,
                        role,
                        is_banned,
                        created_at,
                        updated_at
                        `
                    )
                    .eq(
                        "id",
                        currentUser.id
                    )
                    .maybeSingle();


            if (profileError) {

                console.error(
                    "ERRO PERFIL:",
                    profileError
                );

                return false;
            }


            currentProfile =
                profile;


            if (!currentProfile) {

                return false;
            }


            return true;

        }


        async function requireAuthentication() {

            const valid =
                await loadCurrentUser();


            if (!valid) {

                window.location.href =
                    "../";

                return false;
            }


            if (
                currentProfile.is_banned
            ) {

                alert(
                    "Esta conta está suspensa."
                );


                await supabaseClient.auth.signOut();


                window.location.href =
                    "../";

                return false;
            }


            if (
                currentProfile.role ===
                "user"
            ) {

                alert(
                    "Esta conta não possui acesso ao painel editorial."
                );


                window.location.href =
                    "../";

                return false;
            }


            return true;

        }


        /* ====================================================
           CABEÇALHO
           ==================================================== */

        function updateHeader() {

            const name =
                currentProfile.display_name ||
                currentUser.email ||
                "Usuário";


            elements.headerUserName.textContent =
                name;


            elements.headerUserRole.textContent =
                roleLabel(
                    currentProfile.role
                );


            elements.dashboardGreeting.textContent =
                `Olá, ${name}. Aqui está a visão geral do seu trabalho editorial.`;


            elements.dashboardRoleBadge.textContent =
                roleLabel(
                    currentProfile.role
                );


            const descriptions = {

                journalist:
                    "Você pode criar e administrar suas próprias notícias.",

                editor:
                    "Você possui acesso editorial às notícias e categorias.",

                superadmin:
                    "Você possui acesso completo ao painel e à administração do sistema."

            };


            elements.dashboardRoleDescription.textContent =
                descriptions[
                    currentProfile.role
                ] || "";

        }


        /* ====================================================
           NAVEGAÇÃO
           ==================================================== */

        function openSection(
            sectionName
        ) {

            if (
                sectionName ===
                "users" &&
                !isSuperadmin()
            ) {

                showMessage(
                    "A área de usuários é exclusiva do superadmin.",
                    true
                );

                return;
            }


            document
                .querySelectorAll(
                    ".admin-section"
                )
                .forEach(
                    section => {

                        section.classList.toggle(
                            "active",
                            section.dataset.sectionPanel ===
                            sectionName
                        );

                    }
                );


            document
                .querySelectorAll(
                    ".admin-nav-item"
                )
                .forEach(
                    button => {

                        button.classList.toggle(
                            "active",
                            button.dataset.section ===
                            sectionName
                        );

                    }
                );


            const titles = {

                dashboard:
                    "Dashboard",

                articles:
                    "Notícias",

                "new-article":
                    editingArticleId
                        ? "Editar notícia"
                        : "Nova notícia",

                categories:
                    "Categorias",

                users:
                    "Usuários",

                profile:
                    "Minha conta"

            };


            elements.pageTitle.textContent =
                titles[
                    sectionName
                ] || "Painel";


            elements.sidebar.classList.remove(
                "mobile-open"
            );


            hideMessage();


            if (
                sectionName ===
                "articles"
            ) {

                loadArticles();

            }


            if (
                sectionName ===
                "dashboard"
            ) {

                loadDashboard();

            }


            if (
                sectionName ===
                "categories"
            ) {

                loadCategories();

            }


            if (
                sectionName ===
                "users"
            ) {

                loadUsers();

            }


            if (
                sectionName ===
                "profile"
            ) {

                loadProfileForm();

            }

        }


        document
            .querySelectorAll(
                ".admin-nav-item"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            openSection(
                                button.dataset.section
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                "[data-open-section]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const target =
                                button.dataset.openSection;


                            if (
                                target ===
                                "new-article"
                            ) {

                                prepareNewArticle();

                            }


                            openSection(
                                target
                            );

                        }
                    );

                }
            );


        elements.mobileMenuButton.addEventListener(
            "click",
            () => {

                elements.sidebar.classList.toggle(
                    "mobile-open"
                );

            }
        );


        /* ====================================================
           DASHBOARD
           ==================================================== */

        async function loadDashboard() {

            let query =
                supabaseClient
                    .from("articles")
                    .select(
                        `
                        id,
                        author_id,
                        title,
                        slug,
                        status,
                        created_at,
                        updated_at
                        `
                    );


            if (
                currentProfile.role ===
                "journalist"
            ) {

                query =
                    query.eq(
                        "author_id",
                        currentUser.id
                    );

            }


            const {
                data,
                error
            } =
                await query
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            if (error) {

                console.error(
                    "ERRO DASHBOARD:",
                    error
                );

                return;
            }


            const articles =
                data || [];


            elements.statTotal.textContent =
                articles.length;


            elements.statDrafts.textContent =
                articles.filter(
                    a =>
                        a.status ===
                        "draft"
                ).length;


            elements.statPublished.textContent =
                articles.filter(
                    a =>
                        a.status ===
                        "published"
                ).length;


            elements.statArchived.textContent =
                articles.filter(
                    a =>
                        a.status ===
                        "archived"
                ).length;


            const recent =
                articles.slice(
                    0,
                    5
                );


            if (!recent.length) {

                elements.recentArticles.innerHTML = `
                    <p>
                        Nenhuma notícia encontrada.
                    </p>
                `;

                return;
            }


            elements.recentArticles.innerHTML =
                recent.map(
                    article => `

                        <div class="recent-article">

                            <div>

                                <strong>
                                    ${escapeHtml(
                                        article.title
                                    )}
                                </strong>

                                <span>
                                    ${escapeHtml(
                                        statusLabel(
                                            article.status
                                        )
                                    )}
                                    ·
                                    ${formatDate(
                                        article.created_at
                                    )}
                                </span>

                            </div>

                            <button
                                class="admin-text-button"
                                type="button"
                                data-edit-article="${article.id}"
                            >
                                Editar
                            </button>

                        </div>

                    `
                ).join("");


            elements.recentArticles
                .querySelectorAll(
                    "[data-edit-article]"
                )
                .forEach(
                    button => {

                        button.addEventListener(
                            "click",
                            async () => {

                                await editArticle(
                                    Number(
                                        button.dataset.editArticle
                                    )
                                );

                            }
                        );

                    }
                );

        }


        /* ====================================================
           ARTIGOS
           ==================================================== */

        async function fetchArticles() {

            let query =
                supabaseClient
                    .from("articles")
                    .select(
                        `
                        id,
                        author_id,
                        category_id,
                        title,
                        subtitle,
                        slug,
                        excerpt,
                        content,
                        featured_image_url,
                        featured_image_alt,
                        featured_image_caption,
                        status,
                        published_at,
                        created_at,
                        updated_at
                        `
                    )
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            if (
                currentProfile.role ===
                "journalist"
            ) {

                query =
                    query.eq(
                        "author_id",
                        currentUser.id
                    );

            }


            const {
                data,
                error
            } =
                await query;


            if (error) {

                console.error(
                    "ERRO ARTIGOS:",
                    error
                );

                throw error;
            }


            allArticles =
                data || [];


            return allArticles;

        }


        async function loadArticles() {

            elements.adminArticlesTableBody.innerHTML = `
                <tr>
                    <td
                        colspan="5"
                        class="table-loading"
                    >
                        Carregando notícias...
                    </td>
                </tr>
            `;


            try {

                await fetchArticles();

                renderArticles();

            } catch (error) {

                elements.adminArticlesTableBody.innerHTML = `
                    <tr>
                        <td
                            colspan="5"
                            class="table-empty"
                        >
                            Não foi possível carregar as notícias.
                        </td>
                    </tr>
                `;

            }

        }


        function renderArticles() {

            const status =
                elements.articleStatusFilter.value;


            const author =
                elements.articleAuthorFilter.value;


            let articles =
                [...allArticles];


            if (
                status !==
                "all"
            ) {

                articles =
                    articles.filter(
                        article =>
                            article.status ===
                            status
                    );

            }


            if (
                author !==
                "all"
            ) {

                articles =
                    articles.filter(
                        article =>
                            article.author_id ===
                            author
                    );

            }


            if (!articles.length) {

                elements.adminArticlesTableBody.innerHTML = `
                    <tr>
                        <td
                            colspan="5"
                            class="table-empty"
                        >
                            Nenhuma notícia encontrada.
                        </td>
                    </tr>
                `;

                return;
            }


            elements.adminArticlesTableBody.innerHTML =
                articles.map(
                    article => {

                        const category =
                            allCategories.find(
                                c =>
                                    c.id ===
                                    article.category_id
                            );


                        const author =
                            allProfiles.find(
                                p =>
                                    p.id ===
                                    article.author_id
                            );


                        return `

                            <tr>

                                <td>

                                    <div class="article-table-title">
                                        ${escapeHtml(
                                            article.title
                                        )}
                                    </div>

                                    ${
                                        article.subtitle
                                            ? `
                                                <div class="article-table-subtitle">
                                                    ${escapeHtml(
                                                        article.subtitle
                                                    )}
                                                </div>
                                            `
                                            : ""
                                    }

                                </td>


                                <td>
                                    ${escapeHtml(
                                        author?.display_name ||
                                        "—"
                                    )}
                                </td>


                                <td>

                                    <span
                                        class="article-status-badge ${escapeHtml(
                                            article.status
                                        )}"
                                    >
                                        ${escapeHtml(
                                            statusLabel(
                                                article.status
                                            )
                                        )}
                                    </span>

                                </td>


                                <td>
                                    ${formatDate(
                                        article.created_at
                                    )}
                                </td>


                                <td>

                                    <div
                                        class="article-actions"
                                    >

                                        <button
                                            class="article-action-button"
                                            type="button"
                                            data-edit-id="${article.id}"
                                        >
                                            Editar
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        `;

                    }
                ).join("");


            elements.adminArticlesTableBody
                .querySelectorAll(
                    "[data-edit-id]"
                )
                .forEach(
                    button => {

                        button.addEventListener(
                            "click",
                            async () => {

                                await editArticle(
                                    Number(
                                        button.dataset.editId
                                    )
                                );

                            }
                        );

                    }
                );

        }


        elements.articleStatusFilter.addEventListener(
            "change",
            renderArticles
        );


        elements.articleAuthorFilter.addEventListener(
            "change",
            renderArticles
        );


        elements.refreshArticlesButton.addEventListener(
            "click",
            loadArticles
        );


        /* ====================================================
           PERFIS / AUTORES
           ==================================================== */

        async function loadProfiles() {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("profiles")
                    .select(
                        `
                        id,
                        display_name,
                        avatar_url,
                        role,
                        is_banned,
                        created_at
                        `
                    )
                    .order(
                        "display_name",
                        {
                            ascending: true
                        }
                    );


            if (error) {

                console.error(
                    "ERRO PERFIS:",
                    error
                );

                return;
            }


            allProfiles =
                data || [];


            elements.articleAuthorFilter.innerHTML = `
                <option value="all">
                    Todos
                </option>
            `;


            allProfiles
                .filter(
                    profile =>
                        [
                            "journalist",
                            "editor",
                            "superadmin"
                        ].includes(
                            profile.role
                        )
                )
                .forEach(
                    profile => {

                        elements.articleAuthorFilter.insertAdjacentHTML(
                            "beforeend",
                            `
                                <option
                                    value="${escapeHtml(
                                        profile.id
                                    )}"
                                >
                                    ${escapeHtml(
                                        profile.display_name ||
                                        "Sem nome"
                                    )}
                                </option>
                            `
                        );

                    }
                );

        }


        /* ====================================================
           CATEGORIAS
           ==================================================== */

        async function loadCategories() {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("categories")
                    .select(
                        `
                        id,
                        name,
                        slug,
                        description,
                        created_at
                        `
                    )
                    .order(
                        "name",
                        {
                            ascending: true
                        }
                    );


            if (error) {

                console.error(
                    "ERRO CATEGORIAS:",
                    error
                );

                return;
            }


            allCategories =
                data || [];


            renderCategories();

            populateArticleCategories();

        }


        function renderCategories() {

            if (!allCategories.length) {

                elements.categoriesList.innerHTML = `
                    <p>
                        Nenhuma categoria cadastrada.
                    </p>
                `;

                return;
            }


            elements.categoriesList.innerHTML =
                allCategories.map(
                    category => `

                        <div class="category-item">

                            <div>

                                <h4>
                                    ${escapeHtml(
                                        category.name
                                    )}
                                </h4>

                                <p>
                                    ${escapeHtml(
                                        category.slug
                                    )}
                                </p>

                                ${
                                    category.description
                                        ? `
                                            <p>
                                                ${escapeHtml(
                                                    category.description
                                                )}
                                            </p>
                                        `
                                        : ""
                                }

                            </div>

                            <div class="category-item-actions">

                                <button
                                    class="article-action-button"
                                    type="button"
                                    data-delete-category="${category.id}"
                                >
                                    Excluir
                                </button>

                            </div>

                        </div>

                    `
                ).join("");


            elements.categoriesList
                .querySelectorAll(
                    "[data-delete-category]"
                )
                .forEach(
                    button => {

                        button.addEventListener(
                            "click",
                            () => {

                                confirmAction(
                                    "Excluir categoria",
                                    "Esta ação pode afetar a organização das notícias. Deseja continuar?",
                                    async () => {

                                        await deleteCategory(
                                            Number(
                                                button.dataset.deleteCategory
                                            )
                                        );

                                    }
                                );

                            }
                        );

                    }
                );

        }


        function populateArticleCategories() {

            const currentValue =
                elements.articleCategory.value;


            elements.articleCategory.innerHTML = `
                <option value="">
                    Sem categoria
                </option>
            `;


            allCategories.forEach(
                category => {

                    elements.articleCategory.insertAdjacentHTML(
                        "beforeend",
                        `
                            <option
                                value="${category.id}"
                            >
                                ${escapeHtml(
                                    category.name
                                )}
                            </option>
                        `
                    );

                }
            );


            if (currentValue) {

                elements.articleCategory.value =
                    currentValue;

            }

        }


        elements.categoryForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                if (
                    !isEditorOrAbove()
                ) {

                    showMessage(
                        "Apenas editores e superadmins podem criar categorias.",
                        true
                    );

                    return;
                }


                const name =
                    elements.categoryName.value.trim();


                const slug =
                    elements.categorySlug.value.trim() ||
                    slugify(name);


                const description =
                    elements.categoryDescription.value.trim();


                if (!name || !slug) {

                    showMessage(
                        "Informe o nome e o slug da categoria.",
                        true
                    );

                    return;
                }


                const {
                    error
                } =
                    await supabaseClient
                        .from("categories")
                        .insert({

                            name,

                            slug,

                            description:
                                description ||
                                null

                        });


                if (error) {

                    console.error(
                        "ERRO CRIANDO CATEGORIA:",
                        error
                    );


                    showMessage(
                        error.message,
                        true
                    );

                    return;
                }


                elements.categoryForm.reset();


                await loadCategories();


                showMessage(
                    "Categoria criada com sucesso."
                );

            }
        );


        async function deleteCategory(
            categoryId
        ) {

            if (
                !isEditorOrAbove()
            ) {

                showMessage(
                    "Apenas editores e superadmins podem excluir categorias.",
                    true
                );

                return;
            }


            const {
                error
            } =
                await supabaseClient
                    .from("categories")
                    .delete()
                    .eq(
                        "id",
                        categoryId
                    );


            if (error) {

                console.error(
                    "ERRO EXCLUINDO CATEGORIA:",
                    error
                );


                showMessage(
                    error.message,
                    true
                );

                return;
            }


            await loadCategories();


            showMessage(
                "Categoria excluída."
            );

        }


        /* ====================================================
           EDITOR DE NOTÍCIAS
           ==================================================== */

        function prepareNewArticle() {

            editingArticleId =
                null;


            elements.editingArticleId.value =
                "";


            elements.articleForm.reset();


            elements.articleFormTitle.textContent =
                "Nova notícia";


            elements.articleAuthorDisplay.textContent =
                currentProfile.display_name ||
                currentUser.email ||
                "Você";


            elements.articleStatus.value =
                "draft";


            elements.articlePublishInfo.textContent =
                "A notícia será criada como rascunho.";


            populateArticleCategories();

        }


        async function editArticle(
            articleId
        ) {

            const article =
                allArticles.find(
                    item =>
                        item.id ===
                        articleId
                );


            if (!article) {

                await fetchArticles();

                const refreshed =
                    allArticles.find(
                        item =>
                            item.id ===
                            articleId
                    );


                if (!refreshed) {

                    showMessage(
                        "Notícia não encontrada.",
                        true
                    );

                    return;
                }

                return editArticle(
                    articleId
                );

            }


            const allowed =
                currentProfile.role ===
                "journalist"
                    ? article.author_id ===
                      currentUser.id
                    : [
                        "editor",
                        "superadmin"
                    ].includes(
                        currentProfile.role
                    ) ||
                      article.author_id ===
                      currentUser.id;


            if (!allowed) {

                showMessage(
                    "Você não possui permissão para editar esta notícia.",
                    true
                );

                return;
            }


            editingArticleId =
                article.id;


            elements.editingArticleId.value =
                article.id;


            elements.articleFormTitle.textContent =
                "Editar notícia";


            elements.articleTitle.value =
                article.title ||
                "";


            elements.articleSubtitle.value =
                article.subtitle ||
                "";


            elements.articleSlug.value =
                article.slug ||
                "";


            elements.articleExcerpt.value =
                article.excerpt ||
                "";


            let contentText = "";


            if (
                article.content &&
                typeof article.content ===
                "object"
            ) {

                if (
                    typeof article.content.text ===
                    "string"
                ) {

                    contentText =
                        article.content.text;

                } else {

                    contentText =
                        JSON.stringify(
                            article.content,
                            null,
                            2
                        );

                }

            } else if (
                typeof article.content ===
                "string"
            ) {

                contentText =
                    article.content;

            }


            elements.articleContent.value =
                contentText;


            elements.articleImageUrl.value =
                article.featured_image_url ||
                "";


            elements.articleImageAlt.value =
                article.featured_image_alt ||
                "";


            elements.articleImageCaption.value =
                article.featured_image_caption ||
                "";


            populateArticleCategories();


            elements.articleCategory.value =
                article.category_id
                    ? String(
                        article.category_id
                    )
                    : "";


            elements.articleStatus.value =
                article.status ||
                "draft";


            elements.articlePublishInfo.textContent =
                article.published_at
                    ? `Publicado em ${formatDate(article.published_at)}.`
                    : "Ainda não publicado.";


            const author =
                allProfiles.find(
                    profile =>
                        profile.id ===
                        article.author_id
                );


            elements.articleAuthorDisplay.textContent =
                author?.display_name ||
                article.author_id;


            openSection(
                "new-article"
            );

        }


        elements.articleTitle.addEventListener(
            "input",
            () => {

                if (
                    !editingArticleId
                ) {

                    elements.articleSlug.value =
                        slugify(
                            elements.articleTitle.value
                        );

                }

            }
        );


        elements.articleStatus.addEventListener(
            "change",
            () => {

                if (
                    elements.articleStatus.value ===
                    "published"
                ) {

                    elements.articlePublishInfo.textContent =
                        "Ao salvar como publicado, a data de publicação será registrada automaticamente.";

                } else {

                    elements.articlePublishInfo.textContent =
                        "A notícia será salva como " +
                        statusLabel(
                            elements.articleStatus.value
                        ).toLowerCase() +
                        ".";

                }

            }
        );


        elements.articleForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const title =
                    elements.articleTitle.value.trim();


                const subtitle =
                    elements.articleSubtitle.value.trim();


                const slug =
                    elements.articleSlug.value.trim() ||
                    slugify(title);


                const excerpt =
                    elements.articleExcerpt.value.trim();


                const contentText =
                    elements.articleContent.value.trim();


                const imageUrl =
                    elements.articleImageUrl.value.trim();


                const imageAlt =
                    elements.articleImageAlt.value.trim();


                const imageCaption =
                    elements.articleImageCaption.value.trim();


                const categoryValue =
                    elements.articleCategory.value;


                const status =
                    elements.articleStatus.value;


                if (!title) {

                    showMessage(
                        "O título é obrigatório.",
                        true
                    );

                    return;
                }


                if (!slug) {

                    showMessage(
                        "O slug é obrigatório.",
                        true
                    );

                    return;
                }


                if (!contentText) {

                    showMessage(
                        "O conteúdo é obrigatório.",
                        true
                    );

                    return;
                }


                if (
                    ![
                        "draft",
                        "published",
                        "archived"
                    ].includes(
                        status
                    )
                ) {

                    showMessage(
                        "Status inválido.",
                        true
                    );

                    return;
                }


                /*
                 * O campo content é JSONB.
                 *
                 * Nesta primeira versão utilizamos:
                 *
                 * {
                 *     type: "document",
                 *     text: "..."
                 * }
                 */

                const content = {

                    type:
                        "document",

                    text:
                        contentText

                };


                const payload = {

                    title,

                    subtitle:
                        subtitle ||
                        null,

                    slug,

                    excerpt:
                        excerpt ||
                        null,

                    content,

                    category_id:
                        categoryValue
                            ? Number(
                                categoryValue
                            )
                            : null,

                    featured_image_url:
                        imageUrl ||
                        null,

                    featured_image_alt:
                        imageAlt ||
                        null,

                    featured_image_caption:
                        imageCaption ||
                        null,

                    status

                };


                if (
                    status ===
                    "published"
                ) {

                    payload.published_at =
                        new Date().toISOString();

                } else if (
                    editingArticleId
                ) {

                    /*
                     * Não apagamos published_at de forma automática
                     * ao editar uma notícia existente.
                     */

                }


                try {

                    if (
                        editingArticleId
                    ) {

                        const {
                            error
                        } =
                            await supabaseClient
                                .from("articles")
                                .update(
                                    payload
                                )
                                .eq(
                                    "id",
                                    editingArticleId
                                );


                        if (error) {

                            throw error;
                        }


                        showMessage(
                            "Notícia atualizada com sucesso."
                        );

                    } else {

                        const {
                            error
                        } =
                            await supabaseClient
                                .from("articles")
                                .insert({

                                    ...payload,

                                    author_id:
                                        currentUser.id

                                });


                        if (error) {

                            throw error;
                        }


                        showMessage(
                            "Notícia criada com sucesso."
                        );

                    }


                    await fetchArticles();

                    await loadDashboard();

                    prepareNewArticle();

                    openSection(
                        "articles"
                    );


                } catch (error) {

                    console.error(
                        "ERRO SALVANDO NOTÍCIA:",
                        error
                    );


                    showMessage(
                        error.message ||
                        "Não foi possível salvar a notícia.",
                        true
                    );

                }

            }
        );


        elements.cancelArticleButton.addEventListener(
            "click",
            () => {

                prepareNewArticle();

                openSection(
                    "articles"
                );

            }
        );


        /* ====================================================
           PERFIL
           ==================================================== */

        function loadProfileForm() {

            elements.profileDisplayName.textContent =
                currentProfile.display_name ||
                "Sem nome";


            elements.profileEmail.textContent =
                currentUser.email ||
                "";


            elements.profileRole.textContent =
                roleLabel(
                    currentProfile.role
                );


            elements.profileNameInput.value =
                currentProfile.display_name ||
                "";


            elements.profileAvatarInput.value =
                currentProfile.avatar_url ||
                "";


            const initial =
                (
                    currentProfile.display_name ||
                    currentUser.email ||
                    "?"
                )
                .trim()
                .charAt(0)
                .toUpperCase();


            elements.profileInitial.textContent =
                initial;

        }


        elements.profileForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const displayName =
                    elements.profileNameInput.value.trim();


                const avatarUrl =
                    elements.profileAvatarInput.value.trim();


                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .from("profiles")
                        .update({

                            display_name:
                                displayName ||
                                null,

                            avatar_url:
                                avatarUrl ||
                                null

                        })
                        .eq(
                            "id",
                            currentUser.id
                        )
                        .select()
                        .maybeSingle();


                if (error) {

                    console.error(
                        "ERRO ATUALIZANDO PERFIL:",
                        error
                    );


                    showMessage(
                        error.message,
                        true
                    );

                    return;
                }


                if (data) {

                    currentProfile =
                        data;

                }


                updateHeader();

                loadProfileForm();


                showMessage(
                    "Perfil atualizado com sucesso."
                );

            }
        );


        /* ====================================================
           USUÁRIOS
           ==================================================== */

        async function loadUsers() {

            if (
                !isSuperadmin()
            ) {

                return;
            }


            elements.usersTableBody.innerHTML = `
                <tr>
                    <td
                        colspan="5"
                        class="table-loading"
                    >
                        Carregando usuários...
                    </td>
                </tr>
            `;


            const {
                data,
                error
            } =
                await supabaseClient
                    .from("profiles")
                    .select(
                        `
                        id,
                        display_name,
                        avatar_url,
                        role,
                        is_banned,
                        created_at,
                        updated_at
                        `
                    )
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            if (error) {

                console.error(
                    "ERRO USUÁRIOS:",
                    error
                );


                elements.usersTableBody.innerHTML = `
                    <tr>
                        <td
                            colspan="5"
                            class="table-empty"
                        >
                            Não foi possível carregar os usuários.
                        </td>
                    </tr>
                `;

                return;
            }


            allProfiles =
                data || [];


            renderUsers();

        }


        function renderUsers() {

            if (!allProfiles.length) {

                elements.usersTableBody.innerHTML = `
                    <tr>
                        <td
                            colspan="5"
                            class="table-empty"
                        >
                            Nenhum usuário encontrado.
                        </td>
                    </tr>
                `;

                return;
            }


            elements.usersTableBody.innerHTML =
                allProfiles.map(
                    profile => {

                        const canAdminister =
                            profile.id !==
                            currentUser.id;


                        return `

                            <tr>

                                <td>

                                    <div class="article-table-title">
                                        ${escapeHtml(
                                            profile.display_name ||
                                            "Sem nome"
                                        )}
                                    </div>

                                    <div class="article-table-subtitle">
                                        ${escapeHtml(
                                            profile.id
                                        )}
                                    </div>

                                </td>


                                <td>

                                    <span class="article-status-badge">
                                        ${escapeHtml(
                                            roleLabel(
                                                profile.role
                                            )
                                        )}
                                    </span>

                                </td>


                                <td>

                                    <span
                                        class="article-status-badge ${
                                            profile.is_banned
                                                ? "archived"
                                                : "published"
                                        }"
                                    >
                                        ${
                                            profile.is_banned
                                                ? "Banido"
                                                : "Ativo"
                                        }
                                    </span>

                                </td>


                                <td>
                                    ${formatDate(
                                        profile.created_at
                                    )}
                                </td>


                                <td>

                                    <div class="article-actions">

                                        ${
                                            canAdminister
                                                ? `
                                                    <button
                                                        class="article-action-button"
                                                        type="button"
                                                        disabled
                                                        title="Aguardando RPC administrativa segura"
                                                    >
                                                        Gerenciar
                                                    </button>
                                                `
                                                : `
                                                    <span>
                                                        Conta atual
                                                    </span>
                                                `
                                        }

                                    </div>

                                </td>

                            </tr>

                        `;

                    }
                ).join("");

        }


        elements.refreshUsersButton.addEventListener(
            "click",
            loadUsers
        );


        /* ====================================================
           MODAL DE CONFIRMAÇÃO
           ==================================================== */

        let pendingConfirmation =
            null;


        function confirmAction(
            title,
            message,
            callback
        ) {

            pendingConfirmation =
                callback;


            elements.confirmationTitle.textContent =
                title;


            elements.confirmationMessage.textContent =
                message;


            elements.confirmationModal.classList.add(
                "visible"
            );


            elements.confirmationModal.setAttribute(
                "aria-hidden",
                "false"
            );

        }


        function closeConfirmation() {

            pendingConfirmation =
                null;


            elements.confirmationModal.classList.remove(
                "visible"
            );


            elements.confirmationModal.setAttribute(
                "aria-hidden",
                "true"
            );

        }


        elements.confirmationClose.addEventListener(
            "click",
            closeConfirmation
        );


        elements.confirmationCancel.addEventListener(
            "click",
            closeConfirmation
        );


        elements.confirmationConfirm.addEventListener(
            "click",
            async () => {

                if (
                    typeof pendingConfirmation ===
                    "function"
                ) {

                    const callback =
                        pendingConfirmation;


                    closeConfirmation();


                    await callback();

                }

            }
        );


        elements.confirmationModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    elements.confirmationModal
                ) {

                    closeConfirmation();

                }

            }
        );


        /* ====================================================
           LOGOUT
           ==================================================== */

        elements.logoutButton.addEventListener(
            "click",
            async () => {

                const {
                    error
                } =
                    await supabaseClient.auth
                        .signOut();


                if (error) {

                    console.error(
                        "ERRO LOGOUT:",
                        error
                    );

                    showMessage(
                        error.message,
                        true
                    );

                    return;
                }


                window.location.href =
                    "../";

            }
        );


        /* ====================================================
           ESTADO DE AUTENTICAÇÃO
           ==================================================== */

        supabaseClient.auth.onAuthStateChange(
            (
                event
            ) => {

                if (
                    event ===
                    "SIGNED_OUT"
                ) {

                    window.location.href =
                        "../";

                }

            }
        );


        /* ====================================================
           INICIALIZAÇÃO
           ==================================================== */

        const authenticated =
            await requireAuthentication();


        if (!authenticated) {

            return;
        }


        updateHeader();


        if (
            isSuperadmin()
        ) {

            elements.usersNavItem.hidden =
                false;

        }


        await loadProfiles();

        await loadCategories();

        await loadDashboard();

        prepareNewArticle();


        console.log(
            "Boletim Carioca — painel administrativo carregado.",
            {
                user:
                    currentUser.email,

                role:
                    currentProfile.role
            }
        );

    }
);
