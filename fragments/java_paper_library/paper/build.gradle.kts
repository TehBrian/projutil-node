plugins {
    id("@ROOT_PROJECT_NAME@.java-conventions")
}

repositories {
    maven("https://papermc.io/repo/repository/maven-public/") {
        name = "papermc"
    }
}

dependencies {
    api(project(":@ROOT_PROJECT_NAME@-core"))

    compileOnly("io.papermc.paper:paper-api:1.18.2-R0.1-SNAPSHOT")
}
