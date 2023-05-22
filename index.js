import { myTweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
//localStorage.clear()  <--for debugging
/**local storage */

if(!JSON.parse( localStorage.getItem("myTweetsData") )){
localStorage.setItem("myTweetsData",JSON.stringify(myTweetsData))
}
let myTweetsDataFromLocalStorage = JSON.parse( localStorage.getItem("myTweetsData") )
let tweetsData = myTweetsDataFromLocalStorage
     
/**event listeners for icons and buttons */

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyIconClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.replyBtn){
        
        handleReplyBtnClick(e.target.dataset.replyBtn)
    }
    else if(e.target.dataset.deleteReplyBtn){
        
        handleDeleteReplyBtnClick(e.target.dataset.deleteReplyBtn)
    }
    else if(e.target.id === `close-btn-el`){
        closeModalBtn()
    }
})

/**buttons and icon functions */

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    
        if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            isReplied: false,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        localStorage.clear()
        localStorage.setItem("myTweetsData", JSON.stringify(tweetsData) )
        
    render()
    tweetInput.value = ''
    }
    
}

 /**Icons */
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else {
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

/**Opens reply and delete modal */

function handleReplyIconClick(tweetId){
    document.getElementById(`replies-${tweetId}`).classList.toggle('hidden')
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    if(targetTweetObj.isReplied){
        document.getElementById(`delete-reply-modal-el-${tweetId}`).classList.toggle('hidden')
    } else{
        document.getElementById(`reply-modal-el-${tweetId}`).classList.toggle('hidden')
    }
    
    localStorage.clear()
    localStorage.setItem("myTweetsData", JSON.stringify(tweetsData) )
    getFeedHtml()
    
}

function closeModalBtn() {
  const replyModalEl = document.querySelector('.reply-modal:not(.hidden)');
  if (replyModalEl) {
    replyModalEl.classList.add('hidden');
  }
  render();
}

function handleReplyBtnClick(tweetId) {
    const replyModalEl = document.getElementById(`reply-modal-el-${tweetId}`);
    const replyInput = replyModalEl.querySelector('.reply-text-area');
    if (replyModalEl&&replyInput.value) {
        replyModalEl.classList.toggle('hidden');
        
        if (replyInput) {
            const replyText = replyInput.value;
            if (replyText) {
                const tweet = tweetsData.find((tweet) => tweet.uuid === tweetId);
                if (tweet) {
                    tweet.replies.unshift({
                        handle: `@Scrimba`,
                        profilePic: `images/scrimbalogo.png`,
                        tweetText: replyText,
                                            });
                    }
                const targetTweetObj = tweetsData.filter(function(tweet){
                    return tweet.uuid === tweetId
                    })[0]

                if (!targetTweetObj.isReplied){
                        targetTweetObj.isReplied = !targetTweetObj.isReplied
                        }
            
            } /*end of replyText if statement*/
                render();
                replyInput.value = '';
        } /*end of replyInput if statement*/
    }   /*end of replyModal if statement*/
}

function handleDeleteReplyBtnClick(tweetId){
     const deleteReplyModalEl = document.getElementById(`delete-reply-modal-el-${tweetId}`);
    
    if (deleteReplyModalEl) {
        deleteReplyModalEl.classList.toggle('hidden');
        const tweet = tweetsData.find((tweet) => tweet.uuid === tweetId);
                if (tweet) {
                    tweet.replies.shift()[0];
                    }
                const targetTweetObj = tweetsData.filter(function(tweet){
                    return tweet.uuid === tweetId
                    })[0]

                if (targetTweetObj.isReplied){
                        targetTweetObj.isReplied = !targetTweetObj.isReplied
                        }
        
            render();
                
    }   /*end of replyModal if statement*/
 }  

/** Feed */

function getFeedHtml(){
    let feedHtml = ``
    
     
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        let replyIconClass = ''
        if (tweet.isReplied){
            replyIconClass = 'replied'
        }
        
        let repliesHtml = ``
         


        if  (tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+= `
<div class="tweet-reply">
    <div class="tweet-reply-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div class="reply-card">
                <p class="handle">${reply.handle}</p>
                <p class="reply-text ">${reply.tweetText}</p>
            </div>
    </div>
</div>
`
            })
        } 
       
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots ${replyIconClass}"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden tweet-reply-container" id="replies-${tweet.uuid}">
        <div class="reply-modal hidden" id="reply-modal-el-${tweet.uuid}">
            <div class="close-modal-btn-container">
                <button class="modal-close-btn" id="close-btn-el">&times;</button>
            </div>
            <div class="reply-modal-inner" id="reply-modal-inner-el">
                <div class="tweet-tag-container">
                    <div class="tweet-tag-card">
                        <img src="${tweet.profilePic}" class="tweet-tag-img"/> 
                        <p class="tweet-tag-handle">${tweet.handle}</p>
                    </div>   
                    <p class="reply-tweet-text">${tweet.tweetText}</p>
                </div>
                <div class="reply-input-area">
                    <img src="images/scrimbalogo.png" class="profile-pic"> 
                    <textarea placeholder="Enter your reply" class="reply-text-area" id="reply-input-el-${tweet.uuid}" data-reply-text="${tweet.uuid}" ></textarea>
                </div>
                <button class="reply-btn" id="reply-btn-el" data-reply-btn="${tweet.uuid}">Tweet Reply</button> 
            </div>
            ${repliesHtml}  
        </div>
        <div class = "delete-reply-modal hidden" id="delete-reply-modal-el-${tweet.uuid}">
            <div class="close-modal-btn-container">
                <button class="modal-close-btn" id="close-btn-el">&times;</button>
            </div>
            <div class="reply-modal-inner" id="reply-modal-inner-el">
                <div class="tweet-tag-container">
                    <div class="tweet-tag-card">
                        <img src="${tweet.profilePic}" class="tweet-tag-img"/> 
                        <p class="tweet-tag-handle">${tweet.handle}</p>
                    </div>   
                    <p class="reply-tweet-text">${tweet.tweetText}</p>
                </div>
                <button class="delete-reply-btn" id="delete-reply-btn-el" data-delete-reply-btn="${tweet.uuid}">Delete Reply</button> 
            </div>
            ${repliesHtml}
        </div>
    </div>
</div>
`
   })
    
   return feedHtml 
     
}

function render(){
    localStorage.clear()
    localStorage.setItem("myTweetsData", JSON.stringify(tweetsData) )
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()


