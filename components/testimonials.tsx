const featuredTestimonial = {
    body: `Pixelfy is super easy to use, the "prompt builder" module works like a charm, and it's fast. Go give it a try today!`,
    author: {
        name: "Emm",
        handle: "emmanuel_2m",
        imageUrl: "/emm.jpg",
        logoUrl: "/scenario-logo.png",
    },
    twitterLink: "https://twitter.com/emmanuel_2m/status/1653801873789550594",
}
const testimonials = [
    [
        [
            {
                body: "This looks amazing David. Using AI to generate the prompt is genius. Congrats on the launch.",
                author: {
                    name: "shadcn",
                    handle: "shadcn",
                    imageUrl: "/shadcn.jpeg",
                },
                twitterLink:
                    "https://twitter.com/shadcn/status/1653785972780199936",
            },
        ],
        [
            {
                body: "🙏 Great work brother!",
                author: {
                    name: "Sam Selikoff",
                    handle: "samselikoff",
                    imageUrl: "/sam.jpeg",
                },
                twitterLink:
                    "https://twitter.com/samselikoff/status/1653778724016254976",
            },
        ],
    ],
    [
        [
            {
                body: "It looks great man! Well done",
                author: {
                    name: "Hassan El Mghari",
                    handle: "nutlope",
                    imageUrl: "/hassan.jpeg",
                },
                twitterLink:
                    "https://twitter.com/nutlope/status/1653780740814012418",
            },
        ],
        [
            {
                body: `wow this is actually freaking dope 🤯 \n
                
                I typed in "Any Runescape character" and...it brought back so many memories 🥹`,
                author: {
                    name: "Steven Tey",
                    handle: "steventey",
                    imageUrl: "/steven.jpeg",
                },
                twitterLink:
                    "https://twitter.com/steventey/status/1653773350122971137",
            },
        ],
    ],
]

function classNames(...classes) {
    return classes.filter(Boolean).join(" ")
}

export function Testimonials() {
    return (
        <div className="relative isolate bg-transparent pb-16 pt-8 sm:pt-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                    <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                        Testimonials
                    </h2>
                    <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                        See what users are saying about our product
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
                    <a
                        href={featuredTestimonial.twitterLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="col-span-2 hidden sm:block sm:rounded-2xl sm:shadow-lg sm:ring-1 sm:ring-border xl:col-start-2 xl:row-end-1"
                    >
                        <blockquote className="p-12 text-xl font-semibold leading-8 tracking-tight whitespace-pre-line">
                            <p>{`${featuredTestimonial.body}`}</p>
                        </blockquote>
                        <figcaption className="flex items-center gap-x-4 border-t border-gray-900/10 px-6 py-4">
                            <img
                                className="h-10 w-10 flex-none rounded-full bg-gray-50"
                                src={featuredTestimonial.author.imageUrl}
                                alt=""
                            />
                            <div className="flex-auto">
                                <div className="font-semibold">
                                    {featuredTestimonial.author.name}
                                </div>
                                <div className="text-muted-foreground">{`@${featuredTestimonial.author.handle}`}</div>
                            </div>
                            <img
                                className="h-10 w-auto flex-none"
                                src={featuredTestimonial.author.logoUrl}
                                alt=""
                            />
                        </figcaption>
                    </a>
                    {testimonials.map((columnGroup, columnGroupIdx) => (
                        <div
                            key={columnGroupIdx}
                            className="space-y-8 xl:contents xl:space-y-0"
                        >
                            {columnGroup.map((column, columnIdx) => (
                                <div
                                    key={columnIdx}
                                    className={classNames(
                                        (columnGroupIdx === 0 &&
                                            columnIdx === 0) ||
                                            (columnGroupIdx ===
                                                testimonials.length - 1 &&
                                                columnIdx ===
                                                    columnGroup.length - 1)
                                            ? "xl:row-span-2"
                                            : "xl:row-start-1",
                                        "space-y-8"
                                    )}
                                >
                                    {column.map((testimonial) => (
                                        <a
                                            href={testimonial.twitterLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            key={testimonial.author.handle}
                                            className="rounded-2xl  p-6 shadow-lg ring-1 ring-border block"
                                        >
                                            <blockquote>
                                                <p>{`${testimonial.body}`}</p>
                                            </blockquote>
                                            <figcaption className="mt-6 flex items-center gap-x-4">
                                                <img
                                                    className="h-10 w-10 rounded-full bg-gray-50"
                                                    src={
                                                        testimonial.author
                                                            .imageUrl
                                                    }
                                                    alt=""
                                                />
                                                <div>
                                                    <div className="font-semibold">
                                                        {
                                                            testimonial.author
                                                                .name
                                                        }
                                                    </div>
                                                    <div className="text-muted-foreground">{`@${testimonial.author.handle}`}</div>
                                                </div>
                                            </figcaption>
                                        </a>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
