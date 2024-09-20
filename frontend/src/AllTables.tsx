import { TableView } from "./TableView"
import { getData } from "./remote"
//import { Teammate } from "./schema"
import { user, userinfo, post, comment, community, recentactivity, like, dislike, Friendship, CommunityMembers } from "./schema"

const AllTables = () => {
    
    return (

        <div>
            <h2> Users </h2>
            <TableView
                getter={() => getData("users") as Promise<user[]>}
                renderItem={(u: user) => (
                    <div key={u.id}>
                        {u.username}
                        {u.email}
                        {u.password_hash}
                    </div>

                )}
            />.

            <h2> User Info </h2>
            <TableView
                getter={() => getData("userinfo") as Promise<userinfo[]>}
                renderItem={(i: userinfo) => (
                    <div key={i.user}>
                        {i.first_name}
                        {i.last_name}
                        {i.date_of_birth}
                        {i.profile_picture}
                    </div>

                )}
            />.

            <h2> Posts </h2>
            <TableView
                getter={() => getData("posts") as Promise<post[]>}
                renderItem={(p: post) => (
                    <div key={p.id}>
                        {p.user}
                        {p.text}
                        {p.image}
                        {p.datetime}
                        {p.community}
                    </div>

                )}
            />.

            <h2> Comment </h2>
            <TableView
                getter={() => getData("comments") as Promise<comment[]>}
                renderItem={(c: comment) => (
                    <div key={c.id}>
                        {c.user}
                        {c.post}
                        {c.text}
                        {c.datetime}
                    </div>

                )}
            />.

            <h2> Community </h2>
            <TableView
                getter={() => getData("communities") as Promise<community[]>}
                renderItem={(o: community) => (
                    <div key={o.id}>
                        {o.name}
                        {o.picture}
                        {o.description}
                        {o.owner}
                    </div>

                )}
            />.

            <h2> Recent Activity </h2>
            <TableView
                getter={() => getData("recentactivity") as Promise<recentactivity[]>}
                renderItem={(r: recentactivity) => (
                    <div key={r.id}>
                        {r.userid}
                        {r.postid}
                        {r.type}
                        {r.datetime}
                    </div>

                )}
            />.

            <h2> Likes </h2>
            <TableView
                getter={() => getData("likes") as Promise<like[]>}
                renderItem={(l: like) => (
                    <div key={l.id}>
                        {l.user}
                        {l.post}
                        {l.datetime}
                    </div>

                )}
            />.

            <h2> Dislikes </h2>
            <TableView
                getter={() => getData("dislikes") as Promise<dislike[]>}
                renderItem={(d: dislike) => (
                    <div key={d.id}>
                        {d.user}
                        {d.post}
                        {d.datetime}
                    </div>

                )}
            />.

            {/* <h2> Friendship </h2>
            <TableView
                getter={() => getData("friendships") as Promise<Friendship[]>}
                renderItem={(f: Friendship) => (
                    <div key={f.id}>
                        {f.userid}
                        {f.friendid}
                    </div>

                )}
            />. */}

            {/* <h2> Community Members </h2>
            <TableView
                getter={() => getData("communitymembers") as Promise<CommunityMembers[]>}
                renderItem={(m: CommunityMembers) => (
                    <div key={m.id}>
                        {m.userid}
                        {m.communityid}
                    </div>

                )}
            />. */}

        </div>

    );
    
    
};

export default AllTables;