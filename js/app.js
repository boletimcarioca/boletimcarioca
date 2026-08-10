/*
 * ============================================================
 * BOLETIM CARIOCA
 * AUTENTICAÇÃO
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    const authModal = document.getElementById("authModal");

    const authClose = document.getElementById("authClose");

    const loginButton = document.getElementById("loginButton");

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
     * ========================================================
     * UTILITÁRIOS
     * ========================================================
     */

    function showMessage(message, isError = false) {

        authMessage.textContent = message;

        authMessage.classList.add("visible");

        authMessage.classList.toggle(
            "error",
            isError
        );
    }


    function hideMessage() {

        authMessage.textContent = "";

        authMessage.classList.remove(
            "visible",
            "error"
        );
    }


    function openAuthModal(mode = "login") {

        authModal.classList.add("visible");

        hideMessage();

        if (mode === "register") {

            showRegisterForm();

        } else {

            showLoginForm();

        }

    }


    function closeAuthModal() {

        authModal.classList.remove("visible");

        hideMessage();

    }


    function showLoginForm() {

        loginForm.style.display = "flex";

        registerForm.style.display = "none";

        authTitle.textContent = "Entrar";

        authSubtitle.textContent =
            "Entre para participar das conversas do Boletim Carioca.";

        authSwitchText.textContent =
            "Ainda não possui uma conta?";

        authSwitchButton.textContent =
            "Criar conta";

        hideMessage();

    }


    function showRegisterForm() {

        loginForm.style.display = "none";

        registerForm.style.display = "flex";

        authTitle.textContent = "Criar conta";

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
     * ESTADO DO USUÁRIO
     * ========================================================
     */

    async function updateAuthUI() {

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Erro ao obter sessão:",
                error
            );

            return;

        }


        const session = data.session;


        if (!session) {

            loggedOutArea.style.display = "flex";

            loggedInArea.classList.remove(
                "visible"
            );

            return;

        }


        loggedOutArea.style.display = "none";

        loggedInArea.classList.add(
            "visible"
        );


        /*
         * Busca o perfil do usuário.
         */

        const {
            data: profile,
            error: profileError
        } = await supabaseClient
            .from("profiles")
            .select("display_name, role, is_banned")
            .eq("id", session.user.id)
            .single();


        if (profileError) {

            console.error(
                "Erro ao carregar perfil:",
                profileError
            );

            userName.textContent =
                session.user.email;

            return;

        }


        if (profile.is_banned) {

            userName.textContent =
                "Conta suspensa";

            return;

        }


        userName.textContent =
            profile.display_name ||
            session.user.email;

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
                ).value.trim();


            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            if (!email) {

                showMessage(
                    "Digite seu e-mail.",
                    true
                );

                return;

            }


            if (!password) {

                showMessage(
                    "Digite sua senha.",
                    true
                );

                return;

            }


            const {
                error
            } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });


            if (error) {

                console.error(
                    "Erro no login:",
                    error
                );

                showMessage(
                    "E-mail ou senha incorretos.",
                    true
                );

                return;

            }


            closeAuthModal();

            await updateAuthUI();

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
                ).value.trim();


            const email =
                document.getElementById(
                    "registerEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "registerPassword"
                ).value;


            /*
             * ------------------------------------------------
             * VALIDAÇÕES LOCAIS
             * ------------------------------------------------
             *
             * Estas validações acontecem ANTES de qualquer
             * comunicação com o Supabase.
             */

            if (!name) {

                showMessage(
                    "Digite seu nome.",
                    true
                );

                return;

            }


            if (!email) {

                showMessage(
                    "Digite seu e-mail.",
                    true
                );

                return;

            }


            if (password.length < 6) {

                showMessage(
                    "A senha precisa ter pelo menos 6 caracteres.",
                    true
                );

                return;

            }


            /*
             * ------------------------------------------------
             * CRIAÇÃO DA CONTA
             * ------------------------------------------------
             */

            const {
                data,
                error
            } = await supabaseClient.auth.signUp({

                email,

                password,

                options: {

                    data: {

                        full_name: name

                    }

                }

            });


            /*
             * ------------------------------------------------
             * ERRO REAL DO SUPABASE
             * ------------------------------------------------
             */

            if (error) {

                console.error(
                    "Erro no cadastro:",
                    error
                );

                showMessage(
                    error.message,
                    true
                );

                return;

            }


            /*
             * ------------------------------------------------
             * E-MAIL JÁ EXISTENTE
             * ------------------------------------------------
             *
             * Com confirmação de e-mail ativada, o Supabase
             * pode não retornar um erro explícito quando o
             * e-mail já existe.
             *
             * Nesse caso, identities vem vazio.
             */

            if (
                data &&
                data.user &&
                Array.isArray(data.user.identities) &&
                data.user.identities.length === 0
            ) {

                showMessage(
                    "Este e-mail já está cadastrado. Faça login ou use a opção de recuperação de senha.",
                    true
                );

                return;

            }


            /*
             * ------------------------------------------------
             * VERIFICAÇÃO DE RESULTADO
             * ------------------------------------------------
             */

            if (!data || !data.user) {

                console.error(
                    "Cadastro sem usuário retornado:",
                    data
                );

                showMessage(
                    "Não foi possível concluir o cadastro.",
                    true
                );

                return;

            }


            /*
             * ------------------------------------------------
             * CONFIRMAÇÃO DE E-MAIL
             * ------------------------------------------------
             *
             * Como a confirmação de e-mail está ativada,
             * normalmente não haverá uma sessão imediatamente.
             */

            if (!data.session) {

                showMessage(
                    "Conta criada. Verifique seu e-mail para confirmar o cadastro."
                );

                registerForm.reset();

                return;

            }


            /*
             * ------------------------------------------------
             * CADASTRO COM LOGIN IMEDIATO
             * ------------------------------------------------
             */

            closeAuthModal();

            await updateAuthUI();

        }
    );


    /*
     * ========================================================
     * GOOGLE
     * ========================================================
     */

    googleLoginButton.addEventListener(
        "click",
        async () => {

            hideMessage();


            const {
                error
            } = await supabaseClient.auth.signInWithOAuth({

                provider: "google",

                options: {

                    redirectTo:
                        window.location.origin +
                        window.location.pathname

                }

            });


            if (error) {

                showMessage(
                    "Não foi possível iniciar o login com Google.",
                    true
                );

                console.error(error);

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
            } = await supabaseClient.auth.signOut();


            if (error) {

                console.error(
                    "Erro ao sair:",
                    error
                );

                return;

            }


            await updateAuthUI();

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

            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();


            if (!email) {

                showMessage(
                    "Digite seu e-mail primeiro.",
                    true
                );

                return;

            }


            const {
                error
            } = await supabaseClient.auth
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
                    "Erro na recuperação de senha:",
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
     * CONTROLES DA INTERFACE
     * ========================================================
     */

    loginButton.addEventListener(
        "click",
        () => openAuthModal("login")
    );


    registerButton.addEventListener(
        "click",
        () => openAuthModal("register")
    );


    authClose.addEventListener(
        "click",
        closeAuthModal
    );


    authSwitchButton.addEventListener(
        "click",
        () => {

            if (
                loginForm.style.display !== "none"
            ) {

                showRegisterForm();

            } else {

                showLoginForm();

            }

        }
    );


    /*
     * Clicar fora do cartão fecha o modal.
     */

    authModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === authModal
            ) {

                closeAuthModal();

            }

        }
    );


    /*
     * ESC fecha o modal.
     */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                closeAuthModal();

            }

        }
    );


    /*
     * ========================================================
     * OBSERVAR ALTERAÇÕES DE AUTENTICAÇÃO
     * ========================================================
     */

    supabaseClient.auth.onAuthStateChange(
        async () => {

            await updateAuthUI();

        }
    );


    /*
     * ========================================================
     * INICIALIZAÇÃO
     * ========================================================
     */

        /*
     * ========================================================
     * PAINEL EDITORIAL
     * ========================================================
     */

    const editorialPanel =
        document.getElementById("editorialPanel");

    const editorialRole =
        document.getElementById("editorialRole");

    const articlesList =
        document.getElementById("articlesList");

    const newArticleButton =
        document.getElementById("newArticleButton");


    async function getCurrentProfile() {

        const {
            data: {
                user
            },
            error: authError
        } = await supabaseClient.auth.getUser();


        if (authError || !user) {
            return {
                user: null,
                profile: null
            };
        }


        const {
            data: profile,
            error: profileError
        } = await supabaseClient
            .from("profiles")
            .select(
                "id, display_name, role, is_banned"
            )
            .eq("id", user.id)
            .single();


        if (profileError) {

            console.error(
                "Erro ao carregar perfil editorial:",
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


    async function loadEditorialPanel() {

        if (!editorialPanel) {
            return;
        }


        const {
            user,
            profile
        } = await getCurrentProfile();


        if (
            !user ||
            !profile ||
            profile.is_banned
        ) {

            editorialPanel.style.display = "none";

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

            editorialPanel.style.display = "none";

            return;
        }


        editorialPanel.style.display = "block";


        editorialRole.textContent =
            "Você está conectado como " +
            profile.role +
            ".";


        await loadArticles(
            profile.role
        );
    }


    async function loadArticles(role) {

        articlesList.innerHTML = `
            <div class="article-loading">
                Carregando notícias...
            </div>
        `;


        let query = supabaseClient
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
         * busca seus próprios artigos.
         *
         * Editor/SuperAdmin:
         * busca os artigos que o RLS
         * permitir.
         */

        if (role === "journalist") {

            const {
                data: {
                    user
                }
            } = await supabaseClient.auth.getUser();


            query = query.eq(
                "author_id",
                user.id
            );
        }


        const {
            data,
            error
        } = await query;


        if (error) {

            console.error(
                "Erro ao carregar artigos:",
                error
            );


            articlesList.innerHTML = `
                <p>
                    Não foi possível carregar as notícias.
                </p>
            `;

            return;
        }


        if (!data || data.length === 0) {

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
            data.map(article => {

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
                                ${article.status}
                            </div>

                            <h3>
                                ${escapeHtml(
                                    article.title ||
                                    "Sem título"
                                )}
                            </h3>

                            <p>
                                ${date}
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

            }).join("");


        console.log(
            "ARTIGOS EDITORIAIS:",
            data
        );
    }


    function escapeHtml(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    /*
     * ========================================================
     * INICIALIZAÇÃO
     * ========================================================
     */

    await updateAuthUI();

    await loadEditorialPanel();

});
