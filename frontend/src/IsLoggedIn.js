import { BACKEND_PATH, join } from "./PATH";

const isLoggedIn = (LS) => {
    return new Promise((resolve) => {
        const refresh = () => {
            fetch(join(BACKEND_PATH, "/auth/refresh"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: LS.getItem('rt')
                })
            })
                .then(async res => {
                    const response = await res.json();
                    
                    if (res.status === 200) {
                        localStorage.setItem("at", response.at);
                        localStorage.setItem("rt", response.rt);
                        resolve({ loggedIn: true, account: response.account });
                    } else {
                        resolve({ loggedIn: false });
                    }
                });
        }

        if (LS.hasOwnProperty('rt') && LS.getItem('rt') && !LS.hasOwnProperty('at'))
            refresh();

        if (LS.hasOwnProperty('at') && LS.getItem('at')) {
            fetch(join(BACKEND_PATH, "/auth/validateToken"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: LS.getItem('at')
                })
            })
                .then(async res => {
                    const response = await res.json();
                    
                    if (response.account && res.status === 200) 
                        resolve({ loggedIn: true, account: response.account });
                    else if (res.status !== 200) refresh();
                });
        } 
    });
}

export default isLoggedIn;