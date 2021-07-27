rootProject.name = "@ROOT_PROJECT_NAME@"

projects("core", "paper")

fun projects(vararg names: String) {
    include(*names)

    names.forEach {
        project(":$it").name = "@ROOT_PROJECT_NAME@-$it"
    }
}
