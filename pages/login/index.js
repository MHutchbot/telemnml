import Cookies from 'universal-cookie';
import TelegramLoginButton from "telegram-login-button"

export default function login() {
    if (process.browser) {
        console.log(location.hostname)
    }
    return (
        <div style={{margin: "0 auto", backgroundColor: "#0088cc", position: "absolute", height: "100vh", width: "100vw", top: "0", left: "0"}}>
          <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
            }}>
                <TelegramLoginButton
                    botName="vinylnews_bot"
                    usePic={true}
                    dataOnauth={(user) => {
                        if (process.browser) {
                            const cookies = new Cookies();
                            cookies.set("user", JSON.stringify(user));
                            console.log(cookies.get("user"));
                            location.href = "/"
                        }
                    }}
                    style={{display: "inline-block "}}
                />
            </div>
        </div>
    )
}