import { useState, useEffect } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from '../servicies/article'

const Demo = () => {

  const [article, setArticle] = useState({
    url: '',
    summery: '',
  })
  const [allArticle, setAllArticle] = useState([])

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery()

  const [copied,setCopied]=useState()

  useEffect(() => {
    const articlesFromLocaleStorage = JSON.parse(localStorage.getItem('articles'))
    if (articlesFromLocaleStorage) {
      setAllArticle(articlesFromLocaleStorage)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data } = await getSummary({ articleUrl: article.url })
    console.log(data)

    if (data ?.summary) {
      const newArticle = { ...article, summery: data.summary }
      const updatedAllArticles = [newArticle, ...allArticle]
      setArticle(newArticle)
      setAllArticle(updatedAllArticles)
      localStorage.setItem('articles', JSON.stringify(updatedAllArticles))

    }

  }    

  const handleCopy = (copyUrl)=>{
    setCopied(copyUrl)
    navigator.clipboard.writeText(copyUrl)
    setTimeout(()=> setCopied(false),3000)
  }

  return (
    <section className="mt-16 w-full max-w-xl">
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link-icon"
            className="absolute left-0 my-2 ml-3 w-5 "
          />
          <input
            type="url"
            value={article.url}
            placeholder="enter URL"
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="url_input peer"
          />

          <button type='submit' className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700">
            ⏎
          </button>
        </form>
        <div className="flex flex-col gap-1 max-h-[60px] overflow-y-auto">
          {allArticle.map((item, index) => (
            <div key={`link-${index}`} onClick={() => setArticle(item)} className='link_card' >
              <div className="copy_btn" onClick={()=>handleCopy(item.url)} >
                <img src={copied===item.url ? tick :copy} alt="copy_btn" className=' w-[40%] h-[40%] object-contain ' />
              </div>
              <p className='flex-1 font-satoshi text-blue-700 font-medium truncate' >{item.url}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className='w-20 h-20 object-contain' />

        ) : error ? (
          <p className='font-inter font-bold text-black text-center' >well that wasn't supposed to br happen...
            <span>{error ?.data ?.error}</span>
          </p>

        ) : (
              <div className=' flex flex-col gap-3 ' >
                <h2 className="font-satoshi font-bold text-gray-600 text-xl">Articles <span className='blue_gradient' >Summary</span></h2>
                <div className='summary_box' ><p className='font-inter font-medium text-sm text-gray-700' >{article.summery}</p></div>
              </div>
            )}
      </div>
    </section>
  );
};

export default Demo;
