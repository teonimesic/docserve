use std::env;
use std::path::Path;
use std::process::Command;

fn main() {
    // Skip frontend build if SKIP_FRONTEND_BUILD is set (for CI builds)
    if env::var("SKIP_FRONTEND_BUILD").is_ok() {
        println!("cargo:warning=Skipping frontend build (SKIP_FRONTEND_BUILD is set)");
        return;
    }

    // Build the React frontend
    let frontend_dir = Path::new("frontend");

    // Check if frontend directory exists
    if !frontend_dir.exists() {
        println!("cargo:warning=Frontend directory not found, skipping frontend build");
        return;
    }

    // Check if dist already exists (frontend already built)
    let dist_dir = frontend_dir.join("dist");
    if dist_dir.exists() {
        println!("cargo:warning=Frontend already built, skipping");
        return;
    }

    // Install dependencies if node_modules doesn't exist
    let node_modules = frontend_dir.join("node_modules");
    if !node_modules.exists() {
        println!("cargo:warning=Installing frontend dependencies...");
        let npm_install = Command::new("npm")
            .arg("install")
            .current_dir(frontend_dir)
            .status()
            .expect("Failed to run npm install");

        if !npm_install.success() {
            panic!("npm install failed");
        }
    }

    // Build the frontend
    println!("cargo:warning=Building frontend...");
    let npm_build = Command::new("npm")
        .arg("run")
        .arg("build")
        .current_dir(frontend_dir)
        .status()
        .expect("Failed to run npm run build");

    if !npm_build.success() {
        panic!("npm run build failed");
    }

    // Rerun if frontend source files change
    println!("cargo:rerun-if-changed=frontend/src");
    println!("cargo:rerun-if-changed=frontend/package.json");
    println!("cargo:rerun-if-changed=frontend/vite.config.ts");
}
