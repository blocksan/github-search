/**
 * Defines the type for user item returned from API endpoint
 */
export type IUserTypeContent = {
    /**
     * Profile url of the user
     */
    html_url: string;

    /*
    *Avatar url of the user
    */
    avatar_url: string;

    detailInfo:{
        /**
         * Name of the user
         */
        name: string;

        /*
        *Bio of the user
        */
        bio: string;
        /*
        *Public Repository count of the user
        */
        public_repos: number;
    
        /**
         * followers count
         */
        followers: number;
    
        /**
        * Blog link of the user
        */
        blog: string;
    
        /*
        *Joining date of the user
        */
       created_at: string;

       /**
         * Location of the user
         */
        location: string;
    }

}


export interface IBaseUser {
    /*
       *Name of the user
       */
      name: string;
      /*
     *Profile link of the user
     */
     html_url: string;
      /*
     *Profile pic url of the user
     */
     avatar_url: string;
   
     /**
      * Login id of the user
      */
     login: string;
   }