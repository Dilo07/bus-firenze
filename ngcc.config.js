module.exports = {
    packages: {
        'ng2-pdf-viewer': {
            ignorableDeepImportMatchers: [/pdfjs-dist/],
        },
        '@npt/npt-map': {
            ignorableDeepImportMatchers: [/ol\/.*/],
        },
        '@npt/npt-net': {
            ignorableDeepImportMatchers: [/Map/],
        }
    },
};