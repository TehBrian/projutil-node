plugins {
    id("net.kyori.indra.publishing.sonatype") version "3.0.1"
}

group = "@PROJECT_GROUP@"
version = "@PROJECT_VERSION@"
description = "@PROJECT_DESCRIPTION@"

indraSonatype {
    useAlternateSonatypeOSSHost("s01")
}
