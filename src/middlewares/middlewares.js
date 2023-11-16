import loguer from '../winston.js';
//Middleware para obtener la data del usuairo y guardarla para usarla en distintos endpoints
export const getUserData = async (req, res, next) => {
    let userData = null;
    if (req.isAuthenticated()) {
        userData = req.user ? req.user.toObject() : null;
    } else {
        userData = req.session.user || null;
    }
    res.locals.user = userData;
    next();
}
// Middleware para verificar la sesión, si no existe manda a login
export const checkSession = (req, res, next) => {
    if (!req.isAuthenticated() && !req.session.user) {
        loguer.debug('Usuario no identificado');
        return res.redirect('/login')
    }
    next();
};
// Middleware para verificar role de admin, si no es manda a vista de productos
export const checkAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        next();
    } else if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.redirect('/view/products')
    }
}
export const publicAcces = (req, res, next) => {
    if (req.isAuthenticated() || req.session.user) {
        return res.redirect('/view/products')
    }
    next();
}
export const privateAcces = (req, res, next) => {
    if (!req.isAuthenticated() && !req.session.user) {
        return res.redirect('/login')
    }
    next();
}


// Middleware para verificar la sesión y el rol de user
export const checkUserSession = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.role === 'user') {
        next(); // accede solo rol user
    } else if (req.session.user && req.session.user.role === 'user') {
        next(); // accede solo rol user
    } else {
        res.redirect('/view/products'); // manda a la vista de productos para otros usuarios
    }
};
export const checkAdminSession = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        next();
    } else if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.redirect('/view/products');
    }
};

export const checkPremiumSession = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.role === 'premium') {
        next();
    } else if (req.session.user && req.session.user.role === 'premium') {
        next();
    } else {
        res.redirect('/view/products');
    }
};

// se encarga de verificar si un usuario esta autenticado y con cierto rol
export const manageProducts =(req, res, next)=>{
    if (req.isAuthenticated() && req.user && (req.user.role === 'premium' || req.user.role === "admin")) {
        next();
    } else if (req.session.user && (req.session.user.role === 'premium' || req.session.user.role === "admin"))  {
        next();
    } else {
        res.redirect('/view/products');
    }
}

export const checkRole = (req, res, next)=>{
    const isAdmin = res.locals.user && res.locals.user.role === 'admin';
    const premiumRole = res.locals.user && res.locals.user.role === 'premium';
    res.locals.isAdmin = isAdmin;
    res.locals.isPremium = premiumRole;
    next();
}