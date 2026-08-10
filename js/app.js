/*
 * ============================================================
 * BOLETIM CARIOCA
 *
 * AUTENTICAÇÃO
 * PERFIS
 * PAINEL EDITORIAL
 *
 * VERSÃO BASE RECONSTRUÍDA
 * ============================================================
 */


/*
 * ============================================================
 * CONFIGURAÇÃO SUPABASE
 * ============================================================
 *
 * A URL abaixo é a do projeto utilizado nos testes.
 *
 * IMPORTANTE:
 * mantenha aqui a mesma ANON/PUBLISHABLE KEY que já funcionava
 * no seu projeto anterior.
 */

const SUPABASE_URL =
    "https://pnzfvqigcqeoiqiwymzo.supabase.co";


const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuemZ2cWlnY3Flb2lxaXd5bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMTE2NTQsImV4cCI6MjEwMTg4NzY1NH0.4CyQ8Tq00AWJ9eUSbr5Z1kWnqIVwd1k8ooPXEN3uzZU";


/*
 * ============================================================
 * CRIAÇÃO DO CLIENTE
 * ============================================================
 */

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


/*
 * ============================================================
 * APLICAÇÃO
 * ============================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * --------------------------------------------------------
         * GARANTIA DE QUE O SUPABASE EXISTE
         * --------------------------------------------------------
         */

        if (!window.supabaseClient) {

            console.error(
                "supabaseClient não foi inicializado."
            );

            return;
        }


        const supabaseClient =
            window.supabaseClient;


        /*
         * ========================================================
         * ELEMENTOS DO DOM
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
         * --------------------------------------------------------
         * PAINEL EDITORIAL
         * --------------------------------------------------------
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
         * VALIDAÇÃO DOS ELEMENTOS
         * ========================================================
         *
         * Se algum elemento estiver faltando no HTML,
         * descobrimos imediatamente no console.
         */

        const requiredElements = {

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
            forgotPasswordButton,
            editorialPanel,
            editorialRole,
            articlesList,
            newArticleButton

        };


        const missingElements =
            Object.entries(
                requiredElements
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
            missingElements.length > 0
        ) {

            console.error(
                "ELEMENTOS AUSENTES NO HTML:",
                missingElements
            );

            return;
        }


        console.log(
            "Boletim Carioca: interface carregada."
        );


        /*
         * ========================================================
         * UTILITÁRIOS
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
         * PERFIL ATUAL
         * ========================================================
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

        }


        /*
         * ========================================================
         * ATUALIZAÇÃO DA INTERFACE DE AUTENTICAÇÃO
         * ========================================================
         */

        async function updateAuthUI() {

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
             * ----------------------------------------------------
             * USUÁRIO DESLOGADO
             * ----------------------------------------------------
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
             * ----------------------------------------------------
             * USUÁRIO LOGADO
             * ----------------------------------------------------
             */

            loggedOutArea.style.display =
                "none";


            loggedInArea.classList.add(
                "visible"
            );


            userName.textContent =
                session.user.email || "";


            /*
             * Busca perfil.
             */

            const {
                user,
                profile
            } =
                await getCurrentProfile();


            if (
                !user
            ) {

                return;

            }


            if (
                profile
            ) {

                if (
                    profile.is_banned
                ) {

                    userName.textContent =
                        "Conta suspensa";

                } else {

                    userName.textContent =
                        profile.display_name ||
                        user.email ||
                        "";

                }

            }


        }


        /*
         * ========================================================
         * LOGIN
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

            }
        );


        /*
         * ========================================================
         * CADASTRO
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


                if (
                    !name
                ) {

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
                 * Confirmação de e-mail ativada.
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

            }
        );


        /*
         * ========================================================
         * LOGIN GOOGLE
         * ========================================================
         */

        googleLoginButton.addEventListener(
            "click",
            async () => {

                hideMessage();


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

            }
        );


        /*
         * ========================================================
         * LOGOUT
         * ========================================================
         */

        logoutButton.addEventListener(
            "click",
            async () => {

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

            }
        );


        /*
         * ========================================================
         * RECUPERAÇÃO DE SENHA
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

            }
        );


        /*
         * ========================================================
         * BOTÃO ENTRAR
         * ========================================================
         */

        loginButton.addEventListener(
            "click",
            () => {

                console.log(
                    "Abrindo modal de login."
                );


                openAuthModal(
                    "login"
                );

            }
        );


        /*
         * ========================================================
         * BOTÃO CRIAR CONTA
         * ========================================================
         */

        registerButton.addEventListener(
            "click",
            () => {

                console.log(
                    "Abrindo modal de cadastro."
                );


                openAuthModal(
                    "register"
                );

            }
        );


        /*
         * ========================================================
         * FECHAR MODAL
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
         * ALTERNAR LOGIN / CADASTRO
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
         * CLICAR FORA DO MODAL
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
         * ESC
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
         * PAINEL EDITORIAL
         * ========================================================
         */

        async function loadEditorialPanel() {

            /*
             * Se não houver painel, simplesmente não fazemos nada.
             */

            if (
                !editorialPanel
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
             * NÃO LOGADO
             * ----------------------------------------------------
             */

            if (
                !user
            ) {

                editorialPanel.style.display =
                    "none";

                return;

            }


            /*
             * ----------------------------------------------------
             * SEM PERFIL
             * ----------------------------------------------------
             */

            if (
                !profile
            ) {

                editorialPanel.style.display =
                    "none";

                return;

            }


            /*
             * ----------------------------------------------------
             * CONTA BANIDA
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
         * CARREGAR ARTIGOS
         * ========================================================
         */

        async function loadArticles(
            role,
            userId
        ) {

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
             * mostra somente seus próprios artigos.
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
         * NOVA NOTÍCIA
         * ========================================================
         *
         * Ainda não vamos implementar o editor completo.
         * Primeiro estabilizamos a base.
         */

        newArticleButton.addEventListener(
            "click",
            () => {

                console.log(
                    "NOVA NOTÍCIA — editor será implementado na próxima etapa."
                );

                alert(
                    "O editor de notícias será implementado na próxima etapa."
                );

            }
        );


        /*
         * ========================================================
         * ESTADO DE AUTENTICAÇÃO
         * ========================================================
         *
         * Não fazemos operações pesadas diretamente dentro do
         * callback do Supabase.
         */

        supabaseClient.auth.onAuthStateChange(
            () => {

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
         * INICIALIZAÇÃO
         * ========================================================
         */

        (async () => {

            await updateAuthUI();

            await loadEditorialPanel();

        })();

    }
);
