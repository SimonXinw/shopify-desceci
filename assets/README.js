/*一些的命令
# 线上模板
theme get --password=shptka_1509238b3f727d6350756c10e3e883ef --store="awol-vision.myshopify.com" --themeid=136294268976


# 请输入模板 id
theme get --password=shptka_1509238b3f727d6350756c10e3e883ef --store="awol-vision.myshopify.com" --themeid=138609229872

# 监听保存
theme watch

# git 提交清除无需提交文件
git add --renormalize .

# 开发已经存在的指定主题 id
shopify theme dev -t 196474601841 --store=desceci-2.myshopify.com


*/

// 清空哦购物车
fetch("/cart/clear.js", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },  
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("购物车已清空", data);
      // location.reload(); // 如果需要刷新
    });
  
  // 批量请求购物车
  (async function () {
    const url = "https://awolvision.com/cart/add.js";
  
    const requestWithDelay = (id, delay) =>
      new Promise((resolve) => {
        setTimeout(async () => {
          try {
            const response = await fetch(url, {
              headers: {
                accept: "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json",
                priority: "u=1, i",
                "sec-ch-ua":
                  '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
              },
              referrer: "https://awolvision.com/pages/super-bonus",
              referrerPolicy: "strict-origin-when-cross-origin",
              body: JSON.stringify({ items: [{ id, quantity: 1 }] }),
              method: "POST",
              mode: "cors",
              credentials: "include",
            });
  
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
  
            const data = await response.json();
            resolve(data);
          } catch (error) {
            console.error(`Error making request for id ${id}:`, error);
            resolve(null);
          }
        }, delay);
      });
  
    const batchRequests = async (ids) => {
      const results = [];
      for (let i = 0; i < ids.length; i++) {
        const result = await requestWithDelay(ids[i], i * 100); // 每个请求间隔 100ms
        results.push(result);
      }
      return results;
    };
  
    const ids = [
      41714364743728, 41594732150832, 40452023517232, 40452023484464,
      41652445937712, 41061038096432, 41594732150832, 41594732445744,
      41716137099312, 41716137132080, 41716137164848, 41716137197616,
      41716137230384, 41716137263152, 41716137295920, 41716137328688,
      41716137361456, 41716137394224,
    ];
    try {
      const results = await batchRequests(ids);
      console.log("All requests completed:", results);
    } catch (error) {
      console.error("Error in batch requests:", error);
    }
  })();