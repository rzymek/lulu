declare module 'taboverride';

declare module '*.pegjs' {
    const context: any;
    export = context;
}