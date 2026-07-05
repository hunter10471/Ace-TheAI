/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    webpack: (config, { isServer }) => {
        config.module.rules.push({
            test: /\.html$/,
            include: /node_modules/,
            use: "ignore-loader",
        });

        config.module.rules.push({
            test: /\.html$/,
            resourceQuery: /node_modules/,
            use: "ignore-loader",
        });

        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
                crypto: false,
                path: false,
                os: false,
                stream: false,
                util: false,
                buffer: false,
                url: false,
                zlib: false,
                http: false,
                https: false,
                assert: false,
                constants: false,
                domain: false,
                events: false,
                punycode: false,
                querystring: false,
                string_decoder: false,
                sys: false,
                timers: false,
                tty: false,
                vm: false,
            };
        }

        return config;
    },
};

export default nextConfig;
