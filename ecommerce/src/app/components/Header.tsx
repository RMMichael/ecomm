import Link from "next/link";
import {useState} from "react";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <header className={"flex p-4"}>
            <Link href="/" className="py-2 px-4 mr-auto">
                Ecomm
            </Link>
            <nav>
                <ul className={"flex list-style-none"}>
                    <li className={"py-2 px-4"}><Link href="/">Home</Link></li>
                    <li className={"py-2 px-4"}><Link href="/">About</Link></li>
                    <li className={"ml-4"}>
                        { isLoggedIn
                            ? <Link href="/login">
                                <button className={"bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"}>
                                Sign In
                                </button>
                            </Link>
                        : <Link href="/logout">
                                <button className={"bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"}>
                                    Sign Out
                                </button>
                            </Link>
                        }
                    </li>
                </ul>
            </nav>
        </header>
    )
}
