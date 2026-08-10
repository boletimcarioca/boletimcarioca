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


            const {
                error
            } = await supabaseClient.auth.signInWithPassword({
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


            if (error) {

                showMessage(
                    error.message,
                    true
                );

                console.error(error);

                return;

            }


            /*
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

                showMessage(
                    "Não foi possível enviar o e-mail de recuperação.",
                    true
                );

                console.error(error);

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

    updateAuthUI();

});
