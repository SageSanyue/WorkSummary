# sessionStorage和localStorage区别  
(1)localStorage是专为浏览器端缓存而设计的，  
优点：

  * 存储量增大至5MB（由浏览器决定）
  * 不会带到HTTP请求中（只有本地浏览器可访问数据，服务器不能访问本地存储除非特意通过POST或GET通道发送到服务器）
  * API适用于数据存储localStorage.setItem(key, value)    localStorage.getItem(key)  
  * 始终有效，除非用户手动删除  
(2)sessionStorage区别在于应用场景不同：它是根据session过去时间而实现，而localStorage会永久有效。  
sessionStorage用于本地存储一个会话(session)中的数据，这些数据只有在同一个会话中的页面才能访问，并且当会话结束后数据也随之销毁。因此sessionStorage不是一种持久化的本地存储，仅仅是会话级别的存储。当用户关闭浏览器窗口后，数据会被删除。  
使用场景：一些需要及时失效的重要信息放在sessionStorage中，一些不重要但是不经常设置的东西放在localStorage中。  


