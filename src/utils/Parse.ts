import parse from 'minimist';
import builder from 'minimist-options';

export default function Parse(args: string[], opts: {}): parse.ParsedArgs {
    return parse(args, builder(opts));
}