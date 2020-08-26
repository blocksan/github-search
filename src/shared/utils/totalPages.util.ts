export const getTotalPages = (data: string): {status: boolean, pages: number, error?: string} => {
    try{
        let arr = data.split(',')
        let totalPages = 0
        const regex = new RegExp('rel="last"')
        arr.forEach(link => {
            var value = regex.exec(link)
            if (value) {
                let nvalue = value.input.split(';')[0]
                let innerRegex = new RegExp(/&page=[0-9]{1,}/);
                var final = nvalue.match(innerRegex)
                if (final) {
                    let nfinal = final[0].split("=")[1]
                    totalPages = parseInt(nfinal)
                }
            }
        });
        return {status: true,  pages: totalPages}
    }catch(err){
        return {status: true,  pages: 0, error: err.message}
    }
}