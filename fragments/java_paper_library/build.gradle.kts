plugins {
    id("net.kyori.indra.publishing.sonatype") version "2.1.0"
}

group = "@PROJECT_GROUP@"
version = "@PROJECT_VERSION@"
description = "@PROJECT_DESCRIPTION@"

indraSonatype {
    useAlternateSonatypeOSSHost("s01")
}
