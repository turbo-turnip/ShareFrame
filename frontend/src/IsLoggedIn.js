import { BACKEND_PATH, join } from "./PATH";

const isLoggedIn = (LS) => {
    return new Promise((resolve) => {
        const acc = {
            loggedIn: false,
            account: {}
        };

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
                        acc.loggedIn = true;
                        acc.account = response.account;
                        resolve(acc);
                    } else resolve(acc);
                });
        }

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
                    
                    if (response.account && res.status === 200) {
                        acc.loggedIn = true;
                        acc.account = response.account;
                        resolve(acc);
                    } else if (res.status !== 200)
                        refresh();
                });
        } 
        if (LS.hasOwnProperty('rt') && LS.getItem('rt')) {
            refresh();
        }
    });
}

export default isLoggedIn;