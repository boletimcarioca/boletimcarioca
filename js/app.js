```javascript
/*
 * ============================================================
 * BOLETIM CARIOCA
 * ============================================================
 *
 * AUTENTICAÇÃO
 * PERFIS
 * PAINEL EDITORIAL
 *
 * VERSÃO ESTÁVEL DA BASE
 * ============================================================
 */


/*
 * ============================================================
 * 1. CONFIGURAÇÃO SUPABASE
 * ============================================================
 */

const SUPABASE_URL =
    "https://pnzfvqigcqeoiqiwymzo.supabase.co";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuemZ2cWlnY3Flb2lxaXd5bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMTE2NTQsImV4cCI6MjEwMTg4NzY1NH0.4CyQ8Tq00AWJ9eUSbr5Z1kWnqIVwd1k8ooPXEN3uzZU";


/*
 * ============================================================
 * 2. CRIAÇÃO DO CLIENTE SUPABASE
 * ============================================================
 *
 * IMPORTANTE:
 *
 * O CDN do Supabase precisa estar carregado no HTML ANTES
 * deste arquivo.
 *
 * Exemplo:
 *
 * <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 * <script src="js/app.js"></script>
 *
 * O cliente é colocado em:
 *
 * window.supabaseClient
 *
 * Isso também permite testar pelo console.
 */

if (
    !window.supabase ||
    typeof window.supabase.createClient !== "function"
) {

    console.error(
        "ERRO CRÍTICO: Supabase JS não foi carregado antes do app.js."
    );

} else {

    window.supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );

    console.log(
        "Supabase client inicializado:",
        window.supabaseClient
    );
}


/*
 * ============================================================
 * 3. APLICAÇÃO
 * ============================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * --------------------------------------------------------
         * GARANTIA DO CLIENTE
         * --------------------------------------------------------
         */

        const supabaseClient =
            window.supabaseClient;


        if (!supabaseClient) {

            console.error(
                "ERRO CRÍTICO: window.supabaseClient não existe."
            );

            return;
        }


        console.log(
            "Boletim Carioca: app.js iniciado."
        );


        /*
         * ========================================================
         * 4. ELEMENTOS DE AUTENTICAÇÃO
         * ========================================================
         */

        const authModal =
            document.getElementById(
                "authModal"
            );

        const authClose =
            document.getElementById(
                "authClose"
            );

        const loginButton =
            document.getElementById(
                "loginButton"
            );

        const registerButton =
            document.getElementById(
                "registerButton"
            );

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );

        const loggedOutArea =
            document.getElementById(
                "loggedOutArea"
            );

        const loggedInArea =
            document.getElementById(
                "loggedInArea"
            );

        const userName =
            document.getElementById(
                "userName"
            );

        const loginForm =
            document.getElementById(
                "loginForm"
            );

        const registerForm =
            document.getElementById(
                "registerForm"
            );

        const authTitle =
            document.getElementById(
                "authTitle"
            );

        const authSubtitle =
            document.getElementById(
                "authSubtitle"
            );

        const authMessage =
            document.getElementById(
                "authMessage"
            );

        const authSwitchButton =
            document.getElementById(
                "authSwitchButton"
            );

        const authSwitchText =
            document.getElementById(
                "authSwitchText"
            );

        const googleLoginButton =
            document.getElementById(
                "googleLoginButton"
            );

        const forgotPasswordButton =
            document.getElementById(
                "forgotPasswordButton"
            );


        /*
         * ========================================================
         * 5. ELEMENTOS DO PAINEL EDITORIAL
         * ========================================================
         *
         * Estes elementos são opcionais.
         *
         * A autenticação NÃO deve quebrar se o painel ainda
         * não estiver presente no HTML.
         */

        const editorialPanel =
            document.getElementById(
                "editorialPanel"
            );

        const editorialRole =
            document.getElementById(
                "editorialRole"
            );

        const articlesList =
            document.getElementById(
                "articlesList"
            );

        const newArticleButton =
            document.getElementById(
                "newArticleButton"
            );


        /*
         * ========================================================
         * 6. VERIFICAÇÃO DA AUTENTICAÇÃO
         * ========================================================
         */

        const authElements = {

            authModal,
            authClose,
            loginButton,
            registerButton,
            logoutButton,
            loggedOutArea,
            loggedInArea,
            userName,
            loginForm,
            registerForm,
            authTitle,
            authSubtitle,
            authMessage,
            authSwitchButton,
            authSwitchText,
            googleLoginButton,
            forgotPasswordButton

        };


        const missingAuthElements =
            Object.entries(
                authElements
            )
            .filter(
                ([, element]) =>
                    !element
            )
            .map(
                ([name]) =>
                    name
            );


        if (
            missingAuthElements.length > 0
        ) {

            console.error(
                "ELEMENTOS DE AUTENTICAÇÃO AUSENTES:",
                missingAuthElements
            );

            return;
        }


        /*
         * ========================================================
         * 7. UTILITÁRIOS
         * ========================================================
         */

        function showMessage(
            message,
            isError = false
        ) {

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

            authMessage.textContent =
                "";

            authMessage.classList.remove(
                "visible",
                "error"
            );
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
         * ========================================================
         * 8. MODAL
         * ========================================================
         */

        function openAuthModal(
            mode = "login"
        ) {

            hideMessage();

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

            authModal.classList.remove(
                "visible"
            );

            authModal.setAttribute(
                "aria-hidden",
                "true"
            );

            hideMessage();
        }


        function showLoginForm() {

            loginForm.style.display =
                "flex";

            registerForm.style.display =
                "none";

            authTitle.textContent =
                "Entrar";

            authSubtitle.textContent =
                "Entre para participar das conversas do Boletim Carioca.";

            authSwitchText.textContent =
                "Ainda não possui uma conta?";

            authSwitchButton.textContent =
                "Criar conta";

            hideMessage();
        }


        function showRegisterForm() {

            loginForm.style.display =
                "none";

            registerForm.style.display =
                "flex";

            authTitle.textContent =
                "Criar conta";

            authSubtitle.textContent =
                "Crie sua conta para comentar nas notícias.";

            authSwitchText.textContent =
                "Já possui uma conta?";

            authSwitchButton.textContent =
                "Entrar";

            hideMessage();
        }


        /*
         * ========================================================
         * 9. PERFIL ATUAL
         * ========================================================
         */

        async function getCurrentProfile() {

            try {

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
                        "ERRO AO BUSCAR PERFIL:",
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

            } catch (error) {

                console.error(
                    "ERRO INESPERADO AO BUSCAR PERFIL:",
                    error
                );

                return {

                    user: null,
                    profile: null

                };
            }
        }


        /*
         * ========================================================
         * 10. ATUALIZAÇÃO DA INTERFACE
         * ========================================================
         */

        async function updateAuthUI() {

            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth.getSession();


                if (error) {

                    console.error(
                        "ERRO AO OBTER SESSÃO:",
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

                    userName.textContent =
                        "";

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


                userName.textContent =
                    session.user.email ||
                    "";


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

                    userName.textContent =
                        "Conta suspensa";

                    return;
                }


                userName.textContent =
                    profile.display_name ||
                    user.email ||
                    "";

            } catch (error) {

                console.error(
                    "ERRO AO ATUALIZAR INTERFACE:",
                    error
                );
            }
        }


        /*
         * ========================================================
         * 11. LOGIN
         * ========================================================
         */

        loginForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                hideMessage();


                const email =
                    document.getElementById(
                        "loginEmail"
                    )
                    .value
                    .trim();


                const password =
                    document.getElementById(
                        "loginPassword"
                    )
                    .value;


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


                const submitButton =
                    loginForm.querySelector(
                        "button[type='submit']"
                    );


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Entrando...";
                }


                try {

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
                            "ERRO REAL NO LOGIN:",
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

                } catch (error) {

                    console.error(
                        "ERRO INESPERADO NO LOGIN:",
                        error
                    );

                    showMessage(
                        "Ocorreu um erro ao tentar entrar.",
                        true
                    );

                } finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            "Entrar";
                    }
                }
            }
        );


        /*
         * ========================================================
         * 12. CADASTRO
         * ========================================================
         */

        registerForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                hideMessage();


                const name =
                    document.getElementById(
                        "registerName"
                    )
                    .value
                    .trim();


                const email =
                    document.getElementById(
                        "registerEmail"
                    )
                    .value
                    .trim();


                const password =
                    document.getElementById(
                        "registerPassword"
                    )
                    .value;


                if (!name) {

                    showMessage(
                        "Informe seu nome.",
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


                const submitButton =
                    registerForm.querySelector(
                        "button[type='submit']"
                    );


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Criando conta...";
                }


                try {

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
                            "ERRO REAL NO CADASTRO:",
                            error
                        );

                        showMessage(
                            error.message,
                            true
                        );

                        return;
                    }


                    /*
                     * Caso a confirmação de e-mail esteja
                     * ativada, normalmente não haverá sessão.
                     */

                    if (
                        !data.session
                    ) {

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

                } catch (error) {

                    console.error(
                        "ERRO INESPERADO NO CADASTRO:",
                        error
                    );

                    showMessage(
                        "Ocorreu um erro ao criar a conta.",
                        true
                    );

                } finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            "Criar minha conta";
                    }
                }
            }
        );


        /*
         * ========================================================
         * 13. LOGIN COM GOOGLE
         * ========================================================
         */

        googleLoginButton.addEventListener(
            "click",
            async () => {

                hideMessage();


                try {

                    const {
                        error
                    } =
                        await supabaseClient.auth
                            .signInWithOAuth({

                                provider:
                                    "google",

                                options: {

                                    redirectTo:
                                        window.location.origin +
                                        window.location.pathname

                                }

                            });


                    if (error) {

                        console.error(
                            "ERRO GOOGLE:",
                            error
                        );

                        showMessage(
                            "Não foi possível iniciar o login com Google.",
                            true
                        );
                    }

                } catch (error) {

                    console.error(
                        "ERRO INESPERADO GOOGLE:",
                        error
                    );

                    showMessage(
                        "Não foi possível iniciar o login com Google.",
                        true
                    );
                }
            }
        );


        /*
         * ========================================================
         * 14. LOGOUT
         * ========================================================
         */

        logoutButton.addEventListener(
            "click",
            async () => {

                try {

                    const {
                        error
                    } =
                        await supabaseClient.auth
                            .signOut();


                    if (error) {

                        console.error(
                            "ERRO AO SAIR:",
                            error
                        );

                        return;
                    }


                    await updateAuthUI();

                    await loadEditorialPanel();

                } catch (error) {

                    console.error(
                        "ERRO INESPERADO AO SAIR:",
                        error
                    );
                }
            }
        );


        /*
         * ========================================================
         * 15. RECUPERAÇÃO DE SENHA
         * ========================================================
         */

        forgotPasswordButton.addEventListener(
            "click",
            async () => {

                hideMessage();


                const email =
                    document.getElementById(
                        "loginEmail"
                    )
                    .value
                    .trim();


                if (!email) {

                    showMessage(
                        "Digite seu e-mail primeiro.",
                        true
                    );

                    return;
                }


                try {

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
                            "ERRO RECUPERAÇÃO:",
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

                } catch (error) {

                    console.error(
                        "ERRO INESPERADO RECUPERAÇÃO:",
                        error
                    );

                    showMessage(
                        "Não foi possível enviar o e-mail de recuperação.",
                        true
                    );
                }
            }
        );


        /*
         * ========================================================
         * 16. BOTÃO ENTRAR
         * ========================================================
         */

        loginButton.addEventListener(
            "click",
            () => {

                console.log(
                    "Boletim Carioca: botão Entrar clicado."
                );

                openAuthModal(
                    "login"
                );
            }
        );


        /*
         * ========================================================
         * 17. BOTÃO CRIAR CONTA
         * ========================================================
         */

        registerButton.addEventListener(
            "click",
            () => {

                console.log(
                    "Boletim Carioca: botão Criar conta clicado."
                );

                openAuthModal(
                    "register"
                );
            }
        );


        /*
         * ========================================================
         * 18. FECHAR MODAL
         * ========================================================
         */

        authClose.addEventListener(
            "click",
            () => {

                closeAuthModal();

            }
        );


        /*
         * ========================================================
         * 19. ALTERNAR LOGIN/CADASTRO
         * ========================================================
         */

        authSwitchButton.addEventListener(
            "click",
            () => {

                const loginVisible =
                    loginForm.style.display !==
                    "none";


                if (
                    loginVisible
                ) {

                    showRegisterForm();

                } else {

                    showLoginForm();
                }
            }
        );


        /*
         * ========================================================
         * 20. CLICAR FORA DO MODAL
         * ========================================================
         */

        authModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    authModal
                ) {

                    closeAuthModal();
                }
            }
        );


        /*
         * ========================================================
         * 21. ESC
         * ========================================================
         */

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeAuthModal();
                }
            }
        );


        /*
         * ========================================================
         * 22. PAINEL EDITORIAL
         * ========================================================
         */

        async function loadEditorialPanel() {

            /*
             * O painel é opcional nesta fase.
             */

            if (
                !editorialPanel ||
                !editorialRole ||
                !articlesList
            ) {

                return;
            }


            const {
                user,
                profile
            } =
                await getCurrentProfile();


            /*
             * ----------------------------------------------------
             * DESLOGADO
             * ----------------------------------------------------
             */

            if (!user) {

                editorialPanel.style.display =
                    "none";

                return;
            }


            /*
             * ----------------------------------------------------
             * SEM PERFIL
             * ----------------------------------------------------
             */

            if (!profile) {

                editorialPanel.style.display =
                    "none";

                return;
            }


            /*
             * ----------------------------------------------------
             * BANIDO
             * ----------------------------------------------------
             */

            if (
                profile.is_banned
            ) {

                editorialPanel.style.display =
                    "none";

                return;
            }


            /*
             * ----------------------------------------------------
             * FUNÇÕES EDITORIAIS
             * ----------------------------------------------------
             */

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


            /*
             * ----------------------------------------------------
             * MOSTRAR PAINEL
             * ----------------------------------------------------
             */

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
         * ========================================================
         * 23. CARREGAR ARTIGOS
         * ========================================================
         */

        async function loadArticles(
            role,
            userId
        ) {

            if (
                !articlesList
            ) {

                return;
            }


            articlesList.innerHTML = `
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
             *
             * consulta somente os próprios artigos.
             *
             * Isso acompanha as políticas RLS que já
             * validamos no banco.
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
                    "ERRO AO CARREGAR ARTIGOS:",
                    error
                );


                articlesList.innerHTML = `
                    <p>
                        Não foi possível carregar as notícias.
                    </p>
                `;

                return;
            }


            /*
             * ----------------------------------------------------
             * NENHUM ARTIGO
             * ----------------------------------------------------
             */

            if (
                !data ||
                data.length === 0
            ) {

                articlesList.innerHTML = `
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


            /*
             * ----------------------------------------------------
             * LISTA
             * ----------------------------------------------------
             */

            articlesList.innerHTML =
                data
                    .map(
                        (article) => {

                            const date =
                                article.created_at
                                    ? new Date(
                                        article.created_at
                                    )
                                    .toLocaleDateString(
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
                "ARTIGOS EDITORIAIS:",
                data
            );
        }


        /*
         * ========================================================
         * 24. NOVA NOTÍCIA
         * ========================================================
         *
         * O editor completo ainda será implementado.
         *
         * Por enquanto mantemos o botão funcional sem
         * quebrar o restante da aplicação.
         */

        if (
            newArticleButton
        ) {

            newArticleButton.addEventListener(
                "click",
                () => {

                    console.log(
                        "NOVA NOTÍCIA clicada."
                    );

                    alert(
                        "O editor de notícias será implementado na próxima etapa."
                    );
                }
            );
        }


        /*
         * ========================================================
         * 25. ALTERAÇÕES DE AUTENTICAÇÃO
         * ========================================================
         */

        supabaseClient.auth.onAuthStateChange(
            (
                event,
                session
            ) => {

                console.log(
                    "AUTH EVENT:",
                    event
                );


                /*
                 * Não executamos consultas complexas diretamente
                 * dentro do callback.
                 *
                 * O setTimeout permite que a mudança de sessão
                 * seja finalizada antes das consultas seguintes.
                 */

                setTimeout(
                    async () => {

                        await updateAuthUI();

                        await loadEditorialPanel();

                    },
                    0
                );
            }
        );


        /*
         * ========================================================
         * 26. INICIALIZAÇÃO
         * ========================================================
         */

        (async function initializeApp() {

            console.log(
                "Boletim Carioca: inicializando..."
            );


            await updateAuthUI();

            await loadEditorialPanel();


            console.log(
                "Boletim Carioca: inicialização concluída."
            );

        })();

    }
);
```
