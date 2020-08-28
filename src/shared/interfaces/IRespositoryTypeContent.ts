import { IBaseUser } from "./IUserType";

/**
 * Defines the type for repository item returned from API endpoint
 */
export type IRespositoryTypeContent = {

    /**
    * Repository name
    */
   name: string;
   /**
    * Repository url
    */
   html_url: string;
   /**
    * Repository description
    */
   description: string;
   /**
    * Stars count on the repository
    */
   stargazers_count: number;
   /**
    * Forks count on the repository
    */
   forks_count: number;
   /**
    * Archive status of the repository
    */
   archived: boolean;
   /**
    * Private | Public status of the repository
    */
   private: boolean;
   /**
    * Repository creation date
    */
   created_at: string;

   /**
    * owner object returned from github
    */
   owner:IBaseUser;
}