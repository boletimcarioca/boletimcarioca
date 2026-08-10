/*

* ============================================================
* BOLETIM CARIOCA
* AUTENTICAÇÃO + PAINEL EDITORIAL
* ============================================================
  */

/*

* ============================================================
* CONFIGURAÇÃO SUPABASE
* ============================================================
  */

const SUPABASE_URL =
"https://pnzfvqigcqeoiqiwymzo.supabase.co";

/*

* IMPORTANTE:
* MANTENHA AQUI A MESMA ANON KEY QUE VOCÊ JÁ UTILIZAVA.
*
* Não substitua por uma chave inventada.
  */

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuemZ2cWlnY3Flb2lxaXd5bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMTE2NTQsImV4cCI6MjEwMTg4NzY1NH0.4CyQ8Tq00AWJ9eUSbr5Z1kWnqIVwd1k8ooPXEN3uzZU";

const supabaseClient =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_ANON_KEY
);

/*

* ============================================================
* INICIALIZAÇÃO DA INTERFACE
* ============================================================
  */

document.addEventListener(
"DOMContentLoaded",
() => {

```
    /*
     * ====================================================
     * ELEMENTOS DE AUTENTICAÇÃO
     * ====================================================
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
     * ====================================================
     * VERIFICAÇÃO ESTRUTURAL
     * ====================================================
     *
     * Se algum elemento obrigatório estiver ausente,
     * mostramos o problema no console em vez de deixar
     * o aplicativo quebrar silenciosamente.
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

        forgotPasswordButton

    };


    Object.entries(
        requiredElements
    ).forEach(
        (
            [
                name,
                element
            ]
        ) => {

            if (!element) {

                console.error(
                    "ELEMENTO HTML AUSENTE:",
                    name
                );

            }

        }
    );



    /*
     * ====================================================
     * UTILITÁRIOS
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



    function openAuthModal(
        mode = "login"
    ) {

        if (!authModal) {
            return;
        }


        authModal.classList.add(
            "visible"
        );


        hideMessage();


        if (
            mode ===
            "register"
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


        hideMessage();

    }



    function showLoginForm() {

        if (
            !loginForm ||
            !registerForm
        ) {
            return;
        }


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

        if (
            !loginForm ||
            !registerForm
        ) {
            return;
        }


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
     * ====================================================
     * PERFIL DO USUÁRIO
     * ====================================================
     */

    async function getCurrentProfile() {

        const {
            data: {
                user
            },
            error: authError
        } =
            await supabaseClient.auth
                .getUser();


        if (
            authError ||
            !user
        ) {

            return {
                user: null,
                profile: null
            };

        }


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
                .single();


        if (profileError) {

            console.error(
                "ERRO AO CARREGAR PERFIL:",
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

        const {
            data,
            error
        } =
            await supabaseClient.auth
                .getSession();


        if (error) {

            console.error(
                "ERRO AO OBTER SESSÃO:",
                error
            );

            return;
        }


        const session =
            data.session;


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


        loggedOutArea.style.display =
            "none";


        loggedInArea.classList.add(
            "visible"
        );


        const {
            data: profile,
            error: profileError
        } =
            await supabaseClient
                .from("profiles")
                .select(
                    "display_name, role, is_banned"
                )
                .eq(
                    "id",
                    session.user.id
                )
                .single();


        if (profileError) {

            console.error(
                "ERRO AO CARREGAR PERFIL:",
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
     * ====================================================
     * LOGIN
     * ====================================================
     */

    loginForm.addEventListener(
        "submit",
        async (
            event
        ) => {

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


            closeAuthModal();


            await updateAuthUI();


            await loadEditorialPanel();

        }
    );



    /*
     * ====================================================
     * CADASTRO
     * ====================================================
     */

    registerForm.addEventListener(
        "submit",
        async (
            event
        ) => {

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
             * O projeto está configurado para aceitar
             * senha mínima de 6 caracteres.
             *
             * A validação ocorre ANTES do signUp().
             */

            if (
                password.length <
                6
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
             * Se não existe sessão, o Supabase está
             * aguardando confirmação de e-mail.
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


            closeAuthModal();


            await updateAuthUI();


            await loadEditorialPanel();

        }
    );



    /*
     * ====================================================
     * GOOGLE
     * ====================================================
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
     * ====================================================
     * LOGOUT
     * ====================================================
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
     * ====================================================
     * RECUPERAÇÃO DE SENHA
     * ====================================================
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
                    "Não foi possível enviar o e-mail de recuperação.",
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
     * ====================================================
     * CONTROLES DO MODAL
     * ====================================================
     */

    loginButton.addEventListener(
        "click",
        () => {

            openAuthModal(
                "login"
            );

        }
    );


    registerButton.addEventListener(
        "click",
        () => {

            openAuthModal(
                "register"
            );

        }
    );


    authClose.addEventListener(
        "click",
        closeAuthModal
    );


    authSwitchButton.addEventListener(
        "click",
        () => {

            if (
                loginForm.style.display !==
                "none"
            ) {

                showRegisterForm();

            } else {

                showLoginForm();

            }

        }
    );


    authModal.addEventListener(
        "click",
        (
            event
        ) => {

            if (
                event.target ===
                authModal
            ) {

                closeAuthModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        (
            event
        ) => {

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



    async function loadEditorialPanel() {

        if (!editorialPanel) {

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
     * CARREGAMENTO DE ARTIGOS
     * ====================================================
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
                        ascending:
                            false
                    }
                );


        /*
         * Jornalista vê seus próprios artigos.
         *
         * Editor e Superadmin consultam conforme
         * as permissões estabelecidas no RLS.
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
            data.length ===
            0
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
            data.map(
                (
                    article
                ) => {

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
                                        article.status ||
                                        ""
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
            ).join("");


        console.log(
            "ARTIGOS EDITORIAIS:",
            data
        );

    }



    /*
     * ====================================================
     * ESCAPE HTML
     * ====================================================
     */

    function escapeHtml(
        value
    ) {

        return String(
            value
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
     * NOVA NOTÍCIA
     * ====================================================
     */

    if (
        newArticleButton
    ) {

        newArticleButton.addEventListener(
            "click",
            () => {

                console.log(
                    "NOVA NOTÍCIA — editor será implementado na próxima etapa."
                );

            }
        );

    }



    /*
     * ====================================================
     * ALTERAÇÕES DE AUTENTICAÇÃO
     * ====================================================
     */

    supabaseClient.auth.onAuthStateChange(
        () => {

            /*
             * Não usamos await diretamente dentro
             * do callback para evitar problemas de
             * concorrência durante a mudança de sessão.
             */

            updateAuthUI();

            loadEditorialPanel();

        }
    );



    /*
     * ====================================================
     * INICIALIZAÇÃO
     * ====================================================
     */

    updateAuthUI();

    loadEditorialPanel();

}
```

);
