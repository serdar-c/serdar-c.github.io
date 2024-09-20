function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const imgObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;

            img.src = img.dataset.src;
            img.onload = () => {
                img.style.opacity = 1;
            };

            observer.unobserve(img);
        }
    });
});

$(function () {
    const images = document.querySelectorAll("img[data-src]");

    var portfolioFlag = false;

    $(".nav-item").on("click", async function () {
        const id = $(this).attr("id");

        $(".nav-item").each(function () {
            $(this).removeClass("active");
        });
        $(this).addClass("active");

        const promises = [];
        $("#pages .active").each(function () {
            if ($(this).attr("class").includes(id)) return;
            const child = $(this);

            const promise = (async () => {
                child.addClass("move");
                await sleep(200);
                child.removeClass("move")
                child.addClass("zoomOut")
                await sleep(200);
                child.removeClass("zoomOut")
                child.removeClass("active");
            })();

            promises.push(promise);
        });
        await Promise.all(promises);

        const el = $("." + id);
        if (el.attr("class").includes("active")) return;
        el.addClass("zoomOut");
        el.addClass("active");
        await sleep(200);
        el.removeClass("zoomOut");
        el.addClass("zoomIn");
        await sleep(200);
        el.removeClass("zoomIn");

        if (!portfolioFlag && id == "portfolio") {
            portfolioFlag = true;
            await sleep(200);
            images.forEach(img => {
                imgObserver.observe(img);
            });
        }
    });
});