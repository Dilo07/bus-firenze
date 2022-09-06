module.exports = {
    packages: {
        '@npt/npt-map': {
            ignorableDeepImportMatchers: [/ol\/.*/],
        },
        '@npt/npt-net': {
            ignorableDeepImportMatchers: [/Map/],
        }
    },
};