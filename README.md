# B2B Marketplace
B2B Marketplace APIs and Store

### How to Run the APIs?

1. Clone the repository and navigate to the `apis` directory.
2. Install dependencies using 

    ```bash 
    npm install 
    ```
    
3. Create a `.env` file in the root of the `apis` folder with the below contents.

    ```env
    PORT=8080
    DB_HOST=localhost
    DB_PORT=27017
    DB_NAME=b2b-market
    ```

4. Start the development server using 

    ``` bash
    npm run dev
    ```

5. Once running, the APIs will be accessible at [http://localhost:8080](http://localhost:8080).
6. To seed the database, go to the `apis/seed` directory where you'll find `seed.js`.
7. Run `node seed.js` and choose the data you wish to seed. You will be prompted to choose the data you want to seed. Use the ↑ and ↓ arrow keys to select from:

    ``` console
    > Categories
    > Products
    ``` 

8. After selecting an option, press Enter. The script will begin seeding the selected data into the database.

### How to Run the Store?

1. Clone the repository and navigate to the `store` directory. ( Skip this step if you've already cloned the repo )
2. Install dependencies using

    ```bash
    npm install
    ```

3. Create a `.env.local` file in the root of the `store` folder with the below contents. 

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8080/api
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

4. Start the development server using 

    ``` bash
    npm run dev
    ```

5. Once running, the store will be accessible at [http://localhost:3000](http://localhost:3000).
6. By default, you'll be redirected to /search. Alternatively, visit http://localhost:3000/search to explore the B2B Marketplace.