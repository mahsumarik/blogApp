const Category = require("../models/category");
const Blog = require("../models/blog");
const slugField = require("../helpers/slugfield");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Role = require("../models/role");

async function populate() {
  const count = await Category.count();

  if (count == 0) {
    const users = await User.bulkCreate([
      {
        fullName: "sadık turan",
        email: "info@sadikturan.com",
        password: await bcrypt.hash("135790", 10),
      },
      {
        fullName: "çınar turan",
        email: "info@cinarturan.com",
        password: await bcrypt.hash("135790", 10),
      },
      {
        fullName: "ada bilgi",
        email: "info@adabilgi.com",
        password: await bcrypt.hash("135790", 10),
      },
      {
        fullName: "yiğit bilgi",
        email: "info@yiğitbilgi.com",
        password: await bcrypt.hash("135790", 10),
      },
      {
        fullName: "ahmet yılmaz",
        email: "info@ahmetyılmaz.com",
        password: await bcrypt.hash("135790", 10),
      },
    ]);

    const roles = await Role.bulkCreate([
      { roleName: "admin" },
      { roleName: "moderator" },
      { roleName: "quest" },
    ]);

    await users[0].addRole(roles[0]); // admin=> sadikturan

    await users[1].addRole(roles[1]); // moderator=> çınar turan
    await users[2].addRole(roles[1]); // moderator=> ada bilgi

    await users[3].addRole(roles[2]); // quest=> yigitbilgi
    await users[4].addRole(roles[2]); //quest => ahmet yılmaz

    const categories = await Category.bulkCreate([
      { name: "Mobil Geliştirme", url: slugField("Mobil Geliştirme") },
      { name: "Web Geliştirme", url: slugField("Web Geliştirme") },
      { name: "Programlama", url: slugField("Programlama") },
    ]);

    const blogs = await Blog.bulkCreate([
      {
        title: "Komple Uygulamalı Web Geliştirme Eğitimi",
        url: slugField("Komple Uygulamalı Web Geliştirme Eğitimi"),
        subtitle:
          "Sıfırdan ileri seviyeye 'Web Geliştirme': Html, Css, Sass, Flexbox, Bootstrap, Javascript, Angular, JQuery, Asp.Net Mvc&Core Mvc",
        description:
          "Web geliştirme komple bir web sitesinin hem web tasarım (html,css,javascript), hem de web programlama (asp.net mvc) konularının kullanılarak geliştirilmesidir. ",
        image: "1.jpeg",
        homepage: true,
        approval: true,
        userId:2
      },
      {
        title: "Python ile Sıfırdan İleri Seviye Python Programlama",
        url: slugField("Python ile Sıfırdan İleri Seviye Python Programlama"),
        subtitle:
          "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
        description:
          "Python, son zamanların en popüler programlama dili haline geldi. Python' ın bu kadar popüler olmasındaki sebep şüphesiz öğrenmesi kolay bir yazılım dili olmasıdır",
        image: "2.jpeg",
        homepage: true,
        approval: true,
        userId:2
      },
      {
        title: "Sıfırdan İleri Seviye Modern Javascript Dersleri ES7+",
        url: slugField("Sıfırdan İleri Seviye Modern Javascript Dersleri ES7+"),
        subtitle:
          "Modern javascript dersleri ile (ES6 & ES7+) Nodejs, Angular, React ve VueJs için sağlam bir temel oluşturun.",
        description:
          "Neden Javascript? Javascript son zamanlarda en popüler diller arasında yerini aldı hatta Javascript listenin en başında diyebiliriz. Peki son zamanlarda bu kadar popüler hale gelen Javascript nedir?",
        image: "3.jpeg",
        homepage: true,
        approval: true,
        userId:2
      },
      {
        title: "Node.js ile Sıfırdan İleri Seviye Web Geliştirme",
        url: slugField("Node.js ile Sıfırdan İleri Seviye Web Geliştirme"),
        subtitle:
          "Node.js ile sıfırdan ileri seviye dinamik web uygulaması geliştirmeyi öğren.",
        description:
          "En popüler programlama dili olan Javascript programlama dilini artık Node.js sayesinde server tabanlı bir dil olarak kullanabilirsin.Kurs sonunda sadece Javascript programlama dilini kullanarak Fullstack bir web geliştirici olmak istiyorsan hemen kursa katılmalısın! Üstelik 30 gün iade garantisiyle! Kursumuz piyasadaki en popüler ve en güncel Node.js kursudur.",
        image: "4.jpeg",
        homepage: true,
        approval: true,
        userId:3
      },
      {
        title: "Node.js ile Sıfırdan İleri Seviye Web Geliştirme",
        url: slugField("Node.js ile Sıfırdan İleri Seviye Web Geliştirme"),
        subtitle:
          "Node.js ile sıfırdan ileri seviye dinamik web uygulaması geliştirmeyi öğren.",
        description:
          "En popüler programlama dili olan Javascript programlama dilini artık Node.js sayesinde server tabanlı bir dil olarak kullanabilirsin.Kurs sonunda sadece Javascript programlama dilini kullanarak Fullstack bir web geliştirici olmak istiyorsan hemen kursa katılmalısın! Üstelik 30 gün iade garantisiyle! Kursumuz piyasadaki en popüler ve en güncel Node.js kursudur.",
        image: "4.jpeg",
        homepage: true,
        approval: true,
        userId:3
      },
      {
        title: "Node.js ile Sıfırdan İleri Seviye Web Geliştirme",
        url: slugField("Node.js ile Sıfırdan İleri Seviye Web Geliştirme"),
        subtitle:
          "Node.js ile sıfırdan ileri seviye dinamik web uygulaması geliştirmeyi öğren.",
        description:
          "En popüler programlama dili olan Javascript programlama dilini artık Node.js sayesinde server tabanlı bir dil olarak kullanabilirsin.Kurs sonunda sadece Javascript programlama dilini kullanarak Fullstack bir web geliştirici olmak istiyorsan hemen kursa katılmalısın! Üstelik 30 gün iade garantisiyle! Kursumuz piyasadaki en popüler ve en güncel Node.js kursudur.",
        image: "4.jpeg",
        homepage: true,
        approval: true,
        userId:3
      },
      {
        title: "Node.js ile Sıfırdan İleri Seviye Web Geliştirme",
        url: slugField("Node.js ile Sıfırdan İleri Seviye Web Geliştirme"),
        subtitle:
          "Node.js ile sıfırdan ileri seviye dinamik web uygulaması geliştirmeyi öğren.",
        description:
          "En popüler programlama dili olan Javascript programlama dilini artık Node.js sayesinde server tabanlı bir dil olarak kullanabilirsin.Kurs sonunda sadece Javascript programlama dilini kullanarak Fullstack bir web geliştirici olmak istiyorsan hemen kursa katılmalısın! Üstelik 30 gün iade garantisiyle! Kursumuz piyasadaki en popüler ve en güncel Node.js kursudur.",
        image: "4.jpeg",
        homepage: true,
        approval: true,
        userId:3
      },
      {
        title: "Node.js ile Sıfırdan İleri Seviye Web Geliştirme",
        url: slugField("Node.js ile Sıfırdan İleri Seviye Web Geliştirme"),
        subtitle:
          "Node.js ile sıfırdan ileri seviye dinamik web uygulaması geliştirmeyi öğren.",
        description:
          "En popüler programlama dili olan Javascript programlama dilini artık Node.js sayesinde server tabanlı bir dil olarak kullanabilirsin.Kurs sonunda sadece Javascript programlama dilini kullanarak Fullstack bir web geliştirici olmak istiyorsan hemen kursa katılmalısın! Üstelik 30 gün iade garantisiyle! Kursumuz piyasadaki en popüler ve en güncel Node.js kursudur.",
        image: "4.jpeg",
        homepage: true,
        approval: true,
        userId:3
      },
      {
        title: "Node.js ile Sıfırdan İleri Seviye Web Geliştirme",
        url: slugField("Node.js ile Sıfırdan İleri Seviye Web Geliştirme"),
        subtitle:
          "Node.js ile sıfırdan ileri seviye dinamik web uygulaması geliştirmeyi öğren.",
        description:
          "En popüler programlama dili olan Javascript programlama dilini artık Node.js sayesinde server tabanlı bir dil olarak kullanabilirsin.Kurs sonunda sadece Javascript programlama dilini kullanarak Fullstack bir web geliştirici olmak istiyorsan hemen kursa katılmalısın! Üstelik 30 gün iade garantisiyle! Kursumuz piyasadaki en popüler ve en güncel Node.js kursudur.",
        image: "4.jpeg",
        homepage: true,
        approval: true,
        userId:3
      },
    ]);

    await categories[0].addBlog(blogs[0]);
    await categories[0].addBlog(blogs[1]);
    await categories[0].addBlog(blogs[2]);
    await categories[0].addBlog(blogs[3]);
    await categories[0].addBlog(blogs[4]);
    await categories[0].addBlog(blogs[5]);
    await categories[0].addBlog(blogs[6]);
    await categories[1].addBlog(blogs[7]);
    await categories[1].addBlog(blogs[8]);

    await categories[1].addBlog(blogs[2]);
    await categories[1].addBlog(blogs[3]);
    await categories[2].addBlog(blogs[2]);
    await categories[2].addBlog(blogs[3]);

    await blogs[0].addCategory(categories[1]);
  }
}

module.exports = populate;
