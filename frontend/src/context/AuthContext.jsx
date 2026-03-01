import { createContext, useEffect , useState } from "react";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user , setuser] = useState(null);
    const [loading , setloading] = useState(true);
    // loading or set loading buttins ko disable or enable krne ke liye use kr rhe hai 
    // like after Submit buttin ko disable kr do usi way me yha use krenge

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        if(storedUser && storedToken)
        {
            setuser(JSON.parse(storedUser));
        }
        setloading(false);
    }, []);




    // login user after signup or login
    const login = (data) => {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        setuser(data.user);
    }

    // logout user

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setuser(null);
    }



    return (
        <AuthContext.Provider value={{ user , login , logout , loading}}>
            {children}
        </AuthContext.Provider>
    )
}

