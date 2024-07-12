const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  // secure: process.env.NODE_ENV === 'production',
  // sameSite: 'strict',
};

const API_VERSION = "v1";

const CORS_OPTIONS = {
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3004",
    "http://127.0.0.1:3004",
    `${process.env.FRONTEND_URL}`
  ],
  credentials: true,
};

const FILE_UPLOAD_OPTIONS = {
  useTempFiles: true,
};

export { COOKIE_OPTIONS, API_VERSION, CORS_OPTIONS, FILE_UPLOAD_OPTIONS };
