# prompt reference
Let's build a web app to analyze the replied comments under a wechat video:
read comments.txt, you'll know its structure, as to structure, you can see the attached image for a good reference, basically, it's like this:
commentor1: blahblah
commentor2 replied to commentor1: blahblah reply2
commentor3 replied to commentor2: blahblah reply3
commentor4 replied to commentor1: blahblah reply3
...
we split the page into two panels, left is a texbox which I can paste such comments into, the right shows a table to represent all comments by its structure (you decide how to represent this better); and in between, we have a 'Convert to Table' button, when clicking, convert our comments into the table as you know
below the two panels, in the right , we shall have a button called 'Analyze by AI', when clicking this, a new page shall be redirected to, here we use AI to analyze table data, in our very case here, the comments represent feedback for landlords conspire to lift up selling price of the house, and as you can see, there should be like at least 3 types of replies:
a) support conspiring, usually they represent owners who selling houses
b) doesn't support, usually they are buyers
c) neutral, just watching, or say something irrelevant, or objectively
our analysis shall use gemini ai to output above 3 types of data rows, all texts here are chinese, FYI
let's do this, it's fun

## sample comments here:
米草儿
就应该这样。不能再跌了
兰姐家政
就应该这样。房子不能在被中介勿扰了天天讲跌价
Y
回复兰姐家政：都知道要降息 大放水了/::D
Wilson5176
回复兰姐家政：炒房客的希望
志
让他不卖有可能你真的卖不出去了！全国各地银行自己卖房子了才半价
三从四德
跌哟？
三从四德
会继续跌的？
雷
没有三百万丕卖
   
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1M8Jqr20V0FXwx-BsV1oXqe3AXDGBDKJO

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
