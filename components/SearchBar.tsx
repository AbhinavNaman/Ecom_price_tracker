"use client"
import { scrapeAndStoreProduct } from '@/lib/actions';
import React, {FormEvent, useState} from 'react'

const isValidAmazonProductURL = (url: string) => {
    try {
        const parsedURL = new URL(url);
        const host = parsedURL.hostname;

        if(
            host.includes('amazon.com') ||
            host.includes('amazon.in') ||
            host.includes('amazon.ca') ||
            host.includes('amazon.co.uk') ||
            host.includes('amazon.co.jp') ||
            host.includes('amazon.de') ||
            host.includes('amazon.fr') ||
            host.includes('amazon.') ||
            host.endsWith('amazon')
        ){
            return true;
        }
        else{
            return false;
        }
    } catch (error) {
        return false;
    }
}

const SearchBar = () => {
    const [prompt, setPrompt] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (event : FormEvent<HTMLFormElement>)=> {
        event.preventDefault();

        const isVlidLink = isValidAmazonProductURL(prompt);

        if(!isVlidLink) alert("enter a valid amazon link ")

            try {
                setIsLoading(true);
                const product = await scrapeAndStoreProduct(prompt)
            } catch (error) {
                console.log(error);
                
            }finally{
                setIsLoading(false);
            }

    }
  return (
    <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}>
        <input type="text" placeholder="Search" className='searchbar-input'
            value={prompt} onChange={(e)=> setPrompt(e.target.value)}
        />
        <button type="submit" className='searchbar-btn' disabled={prompt===''}>
            {isLoading ? "Searching ..." : "Search"}
        </button>
    </form>
  )
}

export default SearchBar
