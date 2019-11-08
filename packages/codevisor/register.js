if (process.env.NODE_ENV === "development" && typeof window === "object") {
  require("./register.dev");
}
