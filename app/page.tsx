import HeroCarosel from "@/components/HeroCarosel";
import SearchBar from "@/components/SearchBar";
import Image from "next/image";
import { getAllProducts } from "@/lib/actions";
import ProductCard from "@/components/ProductCard";

const Home = async ()=> {

  const allProducts = await getAllProducts();

  // if(allProducts)console.log(allProducts);
  return (
    <>
      <section className="px-6 md:px-20 py-24">
        <div  className="flex max-xl:flex-col gap-16">
          <div  className="flex flex-col">
            <p className="small-text">
              Start Tracking your Products
              <Image src="/assets/icons/arrow-right.svg" alt="right arrow" width={16} height={16}/>
            </p>

            <h1 className="head-text">
              Tracking price is now Easy with 
              Price<span className="text-yellow-400">Tracker</span>
            </h1>

            <p className="mt-6">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt nihil culpa fugit quia, optio vitae reiciendis quam cupiditate tempore at, nemo eos eligendi nostrum fuga molestiae! Est eos odit amet.
            </p>

            <SearchBar/>
          </div>

          <HeroCarosel />
        </div>
      </section>

      <section className="trending-section">
        <h2 className="section-text">
          Trending
        </h2>
        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProducts?.map((product)=> (
            <ProductCard key={product._id} product={product}/>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home