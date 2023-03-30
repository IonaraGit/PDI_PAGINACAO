module.exports = {
  isAdmin(req, res, next) {
    const isAdminBool = req.servidor.isAdmin;

    if (!isAdminBool) return res.status(403).redirect("/sistemas/pdi/main");

    next();
  },
};
