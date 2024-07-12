import adminRoutes from"./admin/adminRoutes.js";
import userRoutes from "./user/userRoutes.js";
import authRoutes from "./user/authRoutes.js";

const routes = (app) => {
    app.use("/api/auth", authRoutes);
    // User Routes
    app.use("/api/user", userRoutes);
    // Admin Routes
    app.use("/api/admin", adminRoutes);

};

export default routes;