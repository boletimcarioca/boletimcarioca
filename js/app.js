/*
 * ============================================================
 * BOLETIM CARIOCA
 * js/app.js
 *
 * BASE ESTÁVEL
 *
 * - Supabase
 * - Login
 * - Cadastro
 * - Google
 * - Recuperação de senha
 * - Logout
 * - Perfil
 * - Painel editorial
 * - Listagem de artigos
 *
 * IMPORTANTE:
 * Este arquivo deve ser carregado DEPOIS do Supabase JS.
 * ============================================================
 */

(function () {

    "use strict";


    /*
     * ========================================================
     * CONFIGURAÇÃO SUPABASE
     * ========================================================
     */

    const SUPABASE_URL =
        "https://pnzfvqigcqeoiqiwymzo.supabase.co";

    const SUPABASE_ANON_KEY =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuemZ2cWlnY3Flb2lxaXd5bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMTE2NTQsImV4cCI6MjEwMTg4NzY1NH0.4CyQ8Tq00AWJ9eUSbr5Z1kWnqIVwd1k8ooPXEN3uzZU";


    /*
     * ========================================================
     * VERIFICAÇÃO DO SUPABASE
     * ========================================================
     */

    if (
        !window.supabase ||
        typeof window.supabase.createClient !== "function"
    ) {

        console.error(
            "Boletim Carioca: Supabase JS não foi carregado."
        );

        return;
    }


    /*
     * ========================================================
     * CLIENTE SUPABASE
     * ========================================================
     */

    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );


    /*
     * Disponibiliza o cliente globalmente.
     *
     * Isso também permite inspeção pelo console.
     */

    window.supabaseClient =
        supabaseClient;


    /*
     * ========================================================
     * INICIALIZAÇÃO DA INTERFACE
     * ========================================================
     */

    document.addEventListener(
        "DOMContentLoaded",
        initializeApplication
    );


    /*
     * ========================================================
     * APLICAÇÃO
     * ========================================================
     */

    async function initializeApplication() {

        /*
         * ----------------------------------------------------
         * ELEMENTOS DE AUTENTICAÇÃO
         * ----------------------------------------------------
         */

        const authModal =
            document.getElementById("authModal");

        const authClose =
            document.getElementById("authClose");

        const loginButton =
            document.getElementById("loginButton");

        const registerButton =
            document.getElementById("registerButton");

        const logoutButton =
            document.getElementById("logoutButton");

        const loggedOutArea =
            document.getElementById("loggedOutArea");

        const loggedInArea =
            document.getElementById("loggedInArea");

        const userName =
            document.getElementById("userName");

        const loginForm =
            document.getElementById("loginForm");

        const registerForm =
            document.getElementById("registerForm");

        const authTitle =
            document.getElementById("authTitle");

        const authSubtitle =
            document.getElementById("authSubtitle");

        const authMessage =
            document.getElementById("authMessage");

        const authSwitchButton =
            document.getElementById("authSwitchButton");

        const authSwitchText =
            document.getElementById("authSwitchText");

        const googleLoginButton =
            document.getElementById("googleLoginButton");

        const forgotPasswordButton =
            document.getElementById("forgotPasswordButton");


        /*
         * ----------------------------------------------------
         * ELEMENTOS DO PAINEL EDITORIAL
         * ----------------------------------------------------
         */

        const editorialPanel =
            document.getElementById("editorialPanel");

        const editorialRole =
            document.getElementById("editorialRole");

        const articlesList =
            document.getElementById("articlesList");

        const newArticleButton =
            document.getElementById("newArticleButton");


        /*
         * ====================================================
         * FUNÇÕES AUXILIARES DE INTERFACE
         * ====================================================
         */

        function showMessage(
            message,
            isError = false
        ) {

            if (!authMessage) {
                return;
            }

            authMessage.textContent =
                message;

            authMessage.classList.add(
                "visible"
            );

            authMessage.classList.toggle(
                "error",
                isError
            );
        }


        function hideMessage() {

            if (!authMessage) {
                return;
            }

            authMessage.textContent =
                "";

            authMessage.classList.remove(
                "visible",
                "error"
            );
        }


        function showLoginForm() {

            if (loginForm) {
                loginForm.style.display =
                    "flex";
            }

            if (registerForm) {
                registerForm.style.display =
                    "none";
            }

            if (authTitle) {
                authTitle.textContent =
                    "Entrar";
            }

            if (authSubtitle) {
                authSubtitle.textContent =
                    "Entre para participar das conversas do Boletim Carioca.";
            }

            if (authSwitchText) {
                authSwitchText.textContent =
                    "Ainda não possui uma conta?";
            }

            if (authSwitchButton) {
                authSwitchButton.textContent =
                    "Criar conta";
            }

            hideMessage();
        }


        function showRegisterForm() {

            if (loginForm) {
                loginForm.style.display =
                    "none";
            }

            if (registerForm) {
                registerForm.style.display =
                    "flex";
            }

            if (authTitle) {
                authTitle.textContent =
                    "Criar conta";
            }

            if (authSubtitle) {
                authSubtitle.textContent =
                    "Crie sua conta para participar do Boletim Carioca.";
            }

            if (authSwitchText) {
                authSwitchText.textContent =
                    "Já possui uma conta?";
            }

            if (authSwitchButton) {
                authSwitchButton.textContent =
                    "Entrar";
            }

            hideMessage();
        }


        function openAuthModal(
            mode = "login"
        ) {

            if (!authModal) {
                return;
            }

            authModal.classList.add(
                "visible"
            );

            authModal.setAttribute(
                "aria-hidden",
                "false"
            );

            if (
                mode === "register"
            ) {

                showRegisterForm();

            } else {

                showLoginForm();

            }
        }


        function closeAuthModal() {

            if (!authModal) {
                return;
            }

            authModal.classList.remove(
                "visible"
            );

            authModal.setAttribute(
                "aria-hidden",
                "true"
            );

            hideMessage();
        }


        function escapeHtml(
            value
        ) {

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


        /*
         * ====================================================
         * PERFIL ATUAL
         * ====================================================
         */

        async function getCurrentProfile() {

            const {
                data,
                error
            } =
                await supabaseClient.auth.getUser();


            if (
                error ||
                !data ||
                !data.user
            ) {

                return {
                    user: null,
                    profile: null
                };
            }


            const user =
                data.user;


            const {
                data: profile,
                error: profileError
            } =
                await supabaseClient
                    .from("profiles")
                    .select(
                        "id, display_name, role, is_banned"
                    )
                    .eq(
                        "id",
                        user.id
                    )
                    .maybeSingle();


            if (profileError) {

                console.error(
                    "Boletim Carioca — erro ao carregar perfil:",
                    profileError
                );

                return {
                    user,
                    profile: null
                };
            }


            return {
                user,
                profile
            };
        }


        /*
         * ====================================================
         * ATUALIZAÇÃO DA INTERFACE DE AUTENTICAÇÃO
         * ====================================================
         */

        async function updateAuthUI() {

            if (
                !loggedOutArea ||
                !loggedInArea
            ) {
                return;
            }


            const {
                data,
                error
            } =
                await supabaseClient.auth.getSession();


            if (error) {

                console.error(
                    "Boletim Carioca — erro ao obter sessão:",
                    error
                );

                return;
            }


            const session =
                data.session;


            /*
             * ------------------------------------------------
             * DESLOGADO
             * ------------------------------------------------
             */

            if (!session) {

                loggedOutArea.style.display =
                    "flex";

                loggedInArea.classList.remove(
                    "visible"
                );

                if (userName) {
                    userName.textContent =
                        "";
                }

                return;
            }


            /*
             * ------------------------------------------------
             * LOGADO
             * ------------------------------------------------
             */

            loggedOutArea.style.display =
                "none";

            loggedInArea.classList.add(
                "visible"
            );


            if (userName) {

                userName.textContent =
                    session.user.email || "";
            }


            const {
                user,
                profile
            } =
                await getCurrentProfile();


            if (!user) {
                return;
            }


            if (!profile) {
                return;
            }


            if (
                profile.is_banned
            ) {

                if (userName) {

                    userName.textContent =
                        "Conta suspensa";
                }

                return;
            }


            if (userName) {

                userName.textContent =
                    profile.display_name ||
                    user.email ||
                    "";
            }
        }


        /*
         * ====================================================
         * LOGIN
         * ====================================================
         */

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();

                    hideMessage();


                    const emailInput =
                        document.getElementById(
                            "loginEmail"
                        );

                    const passwordInput =
                        document.getElementById(
                            "loginPassword"
                        );


                    const email =
                        emailInput
                            ? emailInput.value.trim()
                            : "";


                    const password =
                        passwordInput
                            ? passwordInput.value
                            : "";


                    if (
                        !email ||
                        !password
                    ) {

                        showMessage(
                            "Preencha e-mail e senha.",
                            true
                        );

                        return;
                    }


                    const {
                        error
                    } =
                        await supabaseClient.auth
                            .signInWithPassword({
                                email,
                                password
                            });


                    if (error) {

                        console.error(
                            "Boletim Carioca — erro de login:",
                            error
                        );

                        showMessage(
                            error.message,
                            true
                        );

                        return;
                    }


                    loginForm.reset();

                    closeAuthModal();

                    await updateAuthUI();

                    await loadEditorialPanel();
                }
            );
        }


        /*
         * ====================================================
         * CADASTRO
         * ====================================================
         */

        if (registerForm) {

            registerForm.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();

                    hideMessage();


                    const nameInput =
                        document.getElementById(
                            "registerName"
                        );

                    const emailInput =
                        document.getElementById(
                            "registerEmail"
                        );

                    const passwordInput =
                        document.getElementById(
                            "registerPassword"
                        );


                    const name =
                        nameInput
                            ? nameInput.value.trim()
                            : "";


                    const email =
                        emailInput
                            ? emailInput.value.trim()
                            : "";


                    const password =
                        passwordInput
                            ? passwordInput.value
                            : "";


                    if (!name) {

                        showMessage(
                            "Informe seu nome.",
                            true
                        );

                        return;
                    }


                    if (!email) {

                        showMessage(
                            "Informe seu e-mail.",
                            true
                        );

                        return;
                    }


                    if (
                        password.length < 6
                    ) {

                        showMessage(
                            "A senha deve ter pelo menos 6 caracteres.",
                            true
                        );

                        return;
                    }


                    const {
                        data,
                        error
                    } =
                        await supabaseClient.auth
                            .signUp({
                                email,
                                password,
                                options: {
                                    data: {
                                        full_name:
                                            name
                                    }
                                }
                            });


                    if (error) {

                        console.error(
                            "Boletim Carioca — erro no cadastro:",
                            error
                        );

                        showMessage(
                            error.message,
                            true
                        );

                        return;
                    }


                    if (!data.session) {

                        showMessage(
                            "Conta criada. Verifique seu e-mail para confirmar o cadastro."
                        );

                        registerForm.reset();

                        return;
                    }


                    registerForm.reset();

                    closeAuthModal();

                    await updateAuthUI();

                    await loadEditorialPanel();
                }
            );
        }


        /*
         * ====================================================
         * LOGIN GOOGLE
         * ====================================================
         */

        if (googleLoginButton) {

            googleLoginButton.addEventListener(
                "click",
                async function () {

                    hideMessage();


                    const {
                        error
                    } =
                        await supabaseClient.auth
                            .signInWithOAuth({
                                provider: "google",
                                options: {
                                    redirectTo:
                                        window.location.origin +
                                        window.location.pathname
                                }
                            });


                    if (error) {

                        console.error(
                            "Boletim Carioca — erro Google:",
                            error
                        );

                        showMessage(
                            error.message,
                            true
                        );
                    }
                }
            );
        }


        /*
         * ====================================================
         * LOGOUT
         * ====================================================
         */

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                async function () {

                    const {
                        error
                    } =
                        await supabaseClient.auth
                            .signOut();


                    if (error) {

                        console.error(
                            "Boletim Carioca — erro ao sair:",
                            error
                        );

                        return;
                    }


                    await updateAuthUI();

                    await loadEditorialPanel();
                }
            );
        }


        /*
         * ====================================================
         * RECUPERAÇÃO DE SENHA
         * ====================================================
         */

        if (forgotPasswordButton) {

            forgotPasswordButton.addEventListener(
                "click",
                async function () {

                    hideMessage();


                    const emailInput =
                        document.getElementById(
                            "loginEmail"
                        );


                    const email =
                        emailInput
                            ? emailInput.value.trim()
                            : "";


                    if (!email) {

                        showMessage(
                            "Digite seu e-mail primeiro.",
                            true
                        );

                        return;
                    }


                    const {
                        error
                    } =
                        await supabaseClient.auth
                            .resetPasswordForEmail(
                                email,
                                {
                                    redirectTo:
                                        window.location.origin +
                                        window.location.pathname
                                }
                            );


                    if (error) {

                        console.error(
                            "Boletim Carioca — erro recuperação:",
                            error
                        );

                        showMessage(
                            error.message,
                            true
                        );

                        return;
                    }


                    showMessage(
                        "Enviamos as instruções de recuperação para seu e-mail."
                    );
                }
            );
        }


        /*
         * ====================================================
         * BOTÃO ENTRAR
         * ====================================================
         */

        if (loginButton) {

            loginButton.addEventListener(
                "click",
                function () {

                    openAuthModal(
                        "login"
                    );
                }
            );
        }


        /*
         * ====================================================
         * BOTÃO CRIAR CONTA
         * ====================================================
         */

        if (registerButton) {

            registerButton.addEventListener(
                "click",
                function () {

                    openAuthModal(
                        "register"
                    );
                }
            );
        }


        /*
         * ====================================================
         * FECHAR MODAL
         * ====================================================
         */

        if (authClose) {

            authClose.addEventListener(
                "click",
                function () {

                    closeAuthModal();
                }
            );
        }


        /*
         * ====================================================
         * ALTERNAR LOGIN / CADASTRO
         * ====================================================
         */

        if (authSwitchButton) {

            authSwitchButton.addEventListener(
                "click",
                function () {

                    const loginVisible =
                        loginForm &&
                        loginForm.style.display !==
                            "none";


                    if (loginVisible) {

                        showRegisterForm();

                    } else {

                        showLoginForm();
                    }
                }
            );
        }


        /*
         * ====================================================
         * CLICAR FORA DO MODAL
         * ====================================================
         */

        if (authModal) {

            authModal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        authModal
                    ) {

                        closeAuthModal();
                    }
                }
            );
        }


        /*
         * ====================================================
         * ESC
         * ====================================================
         */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeAuthModal();
                }
            }
        );


        /*
         * ====================================================
         * PAINEL EDITORIAL
         * ====================================================
         */

        async function loadEditorialPanel() {

            /*
             * O painel é opcional nesta fase.
             */

            if (
                !editorialPanel ||
                !articlesList ||
                !editorialRole
            ) {

                return;
            }


            const {
                user,
                profile
            } =
                await getCurrentProfile();


            if (
                !user ||
                !profile ||
                profile.is_banned
            ) {

                editorialPanel.style.display =
                    "none";

                return;
            }


            const editorialRoles = [
                "journalist",
                "editor",
                "superadmin"
            ];


            if (
                !editorialRoles.includes(
                    profile.role
                )
            ) {

                editorialPanel.style.display =
                    "none";

                return;
            }


            editorialPanel.style.display =
                "block";


            editorialRole.textContent =
                "Você está conectado como " +
                profile.role +
                ".";


            await loadArticles(
                profile.role,
                user.id
            );
        }


        /*
         * ====================================================
         * ARTIGOS
         * ====================================================
         */

        async function loadArticles(
            role,
            userId
        ) {

            if (!articlesList) {
                return;
            }


            articlesList.innerHTML =
                `
                <div class="article-loading">
                    Carregando notícias...
                </div>
                `;


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
                    )
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            /*
             * Jornalista:
             * apenas os próprios artigos.
             *
             * Editor/Superadmin:
             * deixa o RLS decidir o que pode ser visto.
             */

            if (
                role ===
                "journalist"
            ) {

                query =
                    query.eq(
                        "author_id",
                        userId
                    );
            }


            const {
                data,
                error
            } =
                await query;


            if (error) {

                console.error(
                    "Boletim Carioca — erro ao carregar artigos:",
                    error
                );


                articlesList.innerHTML =
                    `
                    <p>
                        Não foi possível carregar as notícias.
                    </p>
                    `;

                return;
            }


            if (
                !data ||
                data.length === 0
            ) {

                articlesList.innerHTML =
                    `
                    <div class="article-empty">

                        <h3>
                            Nenhuma notícia ainda.
                        </h3>

                        <p>
                            Crie sua primeira notícia
                            para começar.
                        </p>

                    </div>
                    `;

                return;
            }


            articlesList.innerHTML =
                data
                    .map(
                        function (article) {

                            const date =
                                article.created_at
                                    ? new Date(
                                        article.created_at
                                    ).toLocaleDateString(
                                        "pt-BR"
                                    )
                                    : "";


                            return `
                                <article
                                    class="editorial-article"
                                >

                                    <div>

                                        <div
                                            class="article-status"
                                        >
                                            ${escapeHtml(
                                                article.status
                                            )}
                                        </div>

                                        <h3>
                                            ${escapeHtml(
                                                article.title ||
                                                "Sem título"
                                            )}
                                        </h3>

                                        <p>
                                            ${escapeHtml(
                                                date
                                            )}
                                        </p>

                                    </div>

                                    <div>

                                        <button
                                            class="auth-button"
                                            type="button"
                                            data-article-id="${article.id}"
                                        >
                                            Editar
                                        </button>

                                    </div>

                                </article>
                            `;
                        }
                    )
                    .join("");


            console.log(
                "Boletim Carioca — artigos:",
                data
            );
        }


        /*
         * ====================================================
         * NOVA NOTÍCIA
         * ====================================================
         */

        if (newArticleButton) {

            newArticleButton.addEventListener(
                "click",
                function () {

                    console.log(
                        "Nova notícia — editor será implementado na próxima etapa."
                    );

                    alert(
                        "O editor de notícias será implementado na próxima etapa."
                    );
                }
            );
        }


        /*
         * ====================================================
         * ESTADO DE AUTENTICAÇÃO
         * ====================================================
         */

        supabaseClient.auth.onAuthStateChange(
            function () {

                setTimeout(
                    function () {

                        updateAuthUI();

                        loadEditorialPanel();

                    },
                    0
                );
            }
        );


        /*
         * ====================================================
         * ESTADO INICIAL
         * ====================================================
         */

        await updateAuthUI();

        await loadEditorialPanel();


        /*
         * ====================================================
         * MARCADOR DE SUCESSO
         * ====================================================
         */

        console.log(
            "Boletim Carioca: aplicação inicializada corretamente."
        );
    }

})();
