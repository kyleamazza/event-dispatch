import {defaultMetadataRegistry} from "./MetadataRegistry";

export function EventSubscriber<T extends {
    new(...args: any[]): {} 
}>(constructor: T) {
    let newConstructor: any = (...args: any[]) => {
        let fn: any = () => {
            defaultMetadataRegistry.addSubscriberMetadata({
                object: constructor,
                instance: undefined,
                args
            });
            return new constructor(...args);
        }

        fn.prototype = constructor.prototype;

        return new fn();
    }

    newConstructor.prototype = constructor.prototype;

    return newConstructor;
}

export function On(eventName: string): Function;
export function On(eventNames: string[]): Function;
export function On(eventNameOrNames: string|string[]): Function {
    return function (object: Object, methodName: string) {
        let eventNames: string[] = [];
        if (eventNameOrNames instanceof Array) {
            eventNames = <string[]> eventNameOrNames;
        } else {
            eventNames = [<string> eventNameOrNames];
        }

        defaultMetadataRegistry.addOnMetadata({
            object: object,
            methodName: methodName,
            eventNames: eventNames
        });
    };
}
