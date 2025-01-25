import mysql from "mysql";
import { parse } from "@std/csv/parse";

const connection = mysql.createConnection({
  host: "你的IP",
  user: "你的用户名",
  password: "你的密码",
  database: "数据库名",
});

connection.connect();

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // 处理根路径，返回HTML页面
  if (url.pathname === "/" && request.method === "GET") {
    const html = await Deno.readTextFile("./index.html");
    return new Response(html, {
      headers: { "content-type": "text/html" },
    });
  }

  // 处理文件上传
  if (url.pathname === "/upload" && request.method === "POST") {

      const formData = await request.formData();
      const file = formData.get("file");
      
      if (file instanceof File) {
        const csvContent = await file.text();
        const result = parse(csvContent, { skipFirstRow: true });

        // 处理CSV数据
        for (const row of result) {
          await new Promise((resolve, reject) => {
            connection.query(
              "INSERT INTO employee (name, gender, age) VALUES (?, ?, ?)",
              [row.Name, row.Gender, row.Age],
              function (error: any, results: any) {
                if (error) reject(error);
                resolve(results);
              },
            );
          });
        }

        return new Response("文件上传并处理成功", { status: 200 });
      }
  }

  return new Response("Not Found", { status: 404 });
}

Deno.serve(handleRequest); 