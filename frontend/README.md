# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




bhai jaise hum backend me middlewares bnate hai or fir req.user ko set krte hai jisse hum use khi pr bhi use kr ske usi trha hum AuthCintext bnate hai
jsime hum localStorage.setItem se token or user set krte hai
fir hume jha bhi zarurt pde vha pr iska use krskte hai
jaise after signup ye sab set kr do or login kr do user ko
ya jaise dashboard ko protected route e rkhna hai tho
protexted route localStorage.getItem krke token check krke he dashboard ka access dega 
aisa kiya ja skta hai

fir isme bhi vhi children vala scene hai
hum app.js ko isme wrap kr dete hai jisee ye authcontext app.jsx ke sare parts ko access kr ske
or app.jsx iska child bn jata hai 
or iske sare functions or objects useStates ko access kr skta hai 
jisse hum un functions orobjects ko call krke set as well as get kr ske elements 

