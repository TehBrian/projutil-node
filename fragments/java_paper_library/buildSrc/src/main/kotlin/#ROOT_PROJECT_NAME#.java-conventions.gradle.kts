plugins {
    `java-library`
    id("org.checkerframework")
    id("net.kyori.indra")
    id("net.kyori.indra.checkstyle")
    id("net.kyori.indra.publishing")
}

group = rootProject.group
version = rootProject.version
description = rootProject.description

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.slf4j:slf4j-api:2.0.0-alpha1")
}

indra {
    javaVersions {
        target(16)
    }

    mitLicense()

    configurePublications{
        pom {
            url.set("@PROJECT_WEBSITE@")

            developers {
                developer {
                    name.set("@DEVELOPER_NAME@")
                    url.set("@DEVELOPER_URL@")
                    email.set("@DEVELOPER_EMAIL@")
                }
            }

            scm {
                connection.set("scm:git:git://@PROJECT_GIT_REPO@.git")
                developerConnection.set("scm:git:ssh://@PROJECT_GIT_REPO@.git")
                url.set("@PROJECT_GIT_REPO@.git")
            }
        }
    }
}
