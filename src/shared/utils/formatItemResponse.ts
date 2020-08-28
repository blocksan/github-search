import { IContentItems } from "../interfaces/IGenericResponse";
import { EContentType } from "../interfaces/EContentType";
import { IUserTypeContent } from "../interfaces/IUserType";
import { IRespositoryTypeContent } from "../interfaces/IRespositoryTypeContent";

export const formatItemResponse = (items: Array<any>, type: EContentType): IContentItems => {
    const formattedResult = []
    items.forEach(iter => {
        if (type === EContentType.user) {
            const { html_url, avatar_url, detailInfo } = iter
            const { name, bio, public_repos, followers, blog, created_at, location } = detailInfo || { name: "", bio: "", public_repos: 0, followers: 0, blog: "", created_at: "", location: "Earth" }
            const item = {
                avatar_url,
                html_url,
                detailInfo: {
                    name,
                    bio,
                    public_repos,
                    followers,
                    blog,
                    created_at,
                    location
                }

            } as IUserTypeContent
            formattedResult.push(item)
        } else {
            const { name, html_url, description, stargazers_count, forks_count, archived, private: isPrivate, created_at, owner } = iter;
            const item = {
                name, 
                html_url, 
                description, 
                stargazers_count, 
                forks_count, 
                archived, 
                private: isPrivate, 
                created_at, 
                owner
            } as IRespositoryTypeContent
            formattedResult.push(item)
        }
    })

    return formattedResult

}