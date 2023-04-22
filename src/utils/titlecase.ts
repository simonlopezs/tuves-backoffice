export function titlecase(str: string) {
    return str.trim().split(' ').map(word => {
        return word[0].toUpperCase() + word.slice(1).toLowerCase()
    }).join(' ')
}