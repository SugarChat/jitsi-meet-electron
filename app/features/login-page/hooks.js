import { googleAuthenticated, facebookAuthenticated } from "./login-service"
import Api from "../../features/api/modules/login"

export const useLoginLogic = () => {
    const onHandleError = () => {
        console.log('Login fail');
      };

    const loginPlatformList = [
        {
            loginType: 'Wechat',
            imageSrc: '../app/images/wechat.png',
            onSuccess: () => {}
        },
        {
            loginType: 'Google',
            imageSrc: '../app/images/google.png',
            onSuccess: async () => {
                const {data, code} = await Api.sign()
            }
        },
        {
            loginType: 'Facebook',
            imageSrc: '../app/images/facebook.png',
            onSuccess: () => {}
        }
    ];

    const onLogin = async ({loginType, onSuccess}) => {
        try {
            switch(loginType) {
                case "Google":
                    await googleAuthenticated().then(({idToken}) =>{
                        onSuccess()
                    }).catch((error) => {
                        console.log(error);
                        // onHandleError()
                    })
                    break
                case 'Wechat': 
                    break
                case 'Facebook':
                    await facebookAuthenticated().then((result) =>{
                        console.log(result);
                    }).catch(() =>{
                        // onHandleError()
                    })
                    break
            }
        } catch (error) {
            console.log(error);
        }
    }

    return {
        onLogin,
        loginPlatformList
    };
};
