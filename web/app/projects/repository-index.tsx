"use client";
import { useState } from "react";
import { PUBLIC_REPOSITORIES, GITHUB_CHECKED } from "../dossier-data";
import { ExternalLink, SectionHeading } from "../components/notebook-ui";

export function RepositoryIndex() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const repositories = PUBLIC_REPOSITORIES.filter(
    (repo) =>
      (kind === "all" || (kind === "forks" ? repo.fork : !repo.fork)) &&
      [repo.name, repo.description, repo.language]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  return (
    <section className="repository-index" id="repositories">
      <SectionHeading
        eyebrow="Nothing hidden / the source index"
        title="Every public repository."
      />
      <p>
        A complete snapshot of my public GitHub, including experiments, source
        archives, and forks. Forks are identified separately—not presented as
        entirely original work.
      </p>
      <div className="repository-toolbar">
        <label className="sr-only" htmlFor="repo-search">
          Search public repositories
        </label>
        <input
          id="repo-search"
          type="search"
          placeholder="Search name, language, or description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className="sr-only" htmlFor="repo-kind">
          Repository type
        </label>
        <select
          id="repo-kind"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          <option value="all">All repositories</option>
          <option value="original">Non-fork repositories</option>
          <option value="forks">Forks only</option>
        </select>
      </div>
      <p className="repo-count" aria-live="polite">
        {repositories.length} of {PUBLIC_REPOSITORIES.length} repositories ·
        checked {GITHUB_CHECKED.slice(0, 10)}
      </p>
      <div className="repo-list">
        {repositories.map((repo) => (
          <article className="repo-row" key={repo.name}>
            <div>
              <h3>
                <a href={repo.url} target="_blank" rel="noreferrer">
                  {repo.name}
                </a>
              </h3>
              <span className="repo-meta">
                {repo.fork ? "Fork / upstream-derived" : "Source repository"} ·{" "}
                {repo.language ?? "Mixed / unclassified"}
                {repo.archived ? " · Archived" : ""}
              </span>
            </div>
            <p>
              {repo.description ??
                "Explore the source, README, and project history on GitHub."}
            </p>
            <div className="link-row">
              <ExternalLink href={repo.url}>Source</ExternalLink>
              {repo.homepage && /^https?:\/\//.test(repo.homepage) && (
                <ExternalLink href={repo.homepage}>Website</ExternalLink>
              )}
            </div>
          </article>
        ))}
      </div>
      {!repositories.length && (
        <p className="empty-state">
          No matches. Try another term or show all repositories.
        </p>
      )}
    </section>
  );
}
