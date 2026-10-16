// packages/contracts/src/contentCatalog.ts
import { DateTime, Option, Schema } from "effect";
import { compare, compareBuild, parse } from "semver";
var CONTENT_CATALOG_LIMITS = {
  entries: 1e4,
  payloadBytes: 4194304,
  mediaBytes: 1073741824,
  skillFiles: 64,
  skillFileBytes: 32000,
  skillTotalBytes: 512000
};
var PositiveInteger = Schema.Int.check(Schema.isBetween({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }));
var text = (maximum) => Schema.String.check(Schema.isMinLength(1), Schema.isMaxLength(maximum));
var Slug = text(128).check(Schema.isPattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/));
var SkillId = text(135).check(Schema.isPattern(/^skills\/[a-z0-9]+(?:-[a-z0-9]+)*$/));
var TechniqueId = text(139).check(Schema.isPattern(/^techniques\/[a-z0-9]+(?:-[a-z0-9]+)*$/));
var ContentId = Schema.Union([SkillId, TechniqueId]);
var ContentChannel = Schema.Literals(["nightly", "stable"]);
var ContentVersion = text(256).check(Schema.makeFilter((value) => /^[0-9]/.test(value) && value.trim() === value && parse(value) !== null));
var Sha256 = Schema.String.check(Schema.isPattern(/^[a-f0-9]{64}$/));
var Timestamp = text(35).check(Schema.isPattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/), Schema.makeFilter((value) => {
  const timestamp = DateTime.make(value);
  return Option.isSome(timestamp) && DateTime.formatIso(timestamp.value) === value.replace(/(?:\.(\d{1,3}))?Z$/, (_, fraction) => `.${(fraction ?? "").padEnd(3, "0")}Z`);
}));
var ContentTargetPath = text(512).check(Schema.makeFilter((value) => value.split("/").length <= 9 && value.split("/").every((segment) => /^[a-zA-Z0-9_.-]+$/.test(segment) && segment !== "." && segment !== ".." && !segment.endsWith(".") && !/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(segment))));
var Filename = ContentTargetPath.check(Schema.makeFilter((value) => !value.includes("/")));
var HttpsUrl = text(2048).check(Schema.makeFilter((value) => {
  const url = URL.parse(value);
  return url !== null && value.startsWith("https://") && !/[\s\\]/.test(value) && url.protocol === "https:" && url.username === "" && url.password === "" && url.hash === "";
}));
var ContentMediaUrl = HttpsUrl.check(Schema.makeFilter((value) => {
  const url = new URL(value);
  return url.origin === "https://cdn.moda.app" && url.pathname.startsWith("/voyager/") && url.pathname.length > "/voyager/".length && !/%(?:2e|2f|5c|00)/i.test(url.pathname) && !value.split(/[?#]/, 1)[0]?.split("/").some((segment) => segment === "." || segment === "..");
}));
var MediaType = text(128).check(Schema.isPattern(/^[a-z0-9][a-z0-9!#$&^_.+-]*\/[a-z0-9][a-z0-9!#$&^_.+-]*$/));
var ContentPayload = Schema.Struct({
  target: ContentTargetPath,
  sha256: Sha256,
  length: PositiveInteger.check(Schema.isLessThanOrEqualTo(CONTENT_CATALOG_LIMITS.payloadBytes)),
  mediaType: MediaType
});
var ContentMedia = Schema.Struct({
  url: ContentMediaUrl,
  sha256: Sha256,
  length: PositiveInteger.check(Schema.isLessThanOrEqualTo(CONTENT_CATALOG_LIMITS.mediaBytes)),
  mediaType: MediaType,
  filename: Filename,
  width: Schema.optional(PositiveInteger.check(Schema.isLessThanOrEqualTo(65535))),
  height: Schema.optional(PositiveInteger.check(Schema.isLessThanOrEqualTo(65535))),
  durationSeconds: Schema.optional(Schema.Finite.check(Schema.isGreaterThan(0), Schema.isLessThanOrEqualTo(86400)))
});
var ContentReference = Schema.Struct({
  id: ContentId,
  revision: PositiveInteger,
  sha256: Sha256
});
var ContentDependency = Schema.Struct({
  id: SkillId,
  minRevision: PositiveInteger,
  maxRevisionExclusive: Schema.optional(PositiveInteger)
}).check(Schema.makeFilter((value) => value.maxRevisionExclusive === undefined || value.maxRevisionExclusive > value.minRevision));
var RevisionFields = {
  revision: PositiveInteger,
  minVoyagerVersion: ContentVersion,
  maxVoyagerVersionExclusive: Schema.optional(ContentVersion),
  requiredCapabilities: Schema.Array(text(128)).check(Schema.isMaxLength(64)),
  dependencies: Schema.Array(ContentDependency).check(Schema.isMaxLength(64)),
  suggestedSkills: Schema.Array(Schema.Struct({ id: SkillId, reason: text(1024) })).check(Schema.isMaxLength(64)),
  payload: ContentPayload,
  title: text(256),
  summary: text(4096),
  tags: Schema.Array(text(128)).check(Schema.isMaxLength(64)),
  outcomes: Schema.Array(text(1024)).check(Schema.isMaxLength(64)),
  prerequisites: Schema.Array(text(1024)).check(Schema.isMaxLength(64)),
  sourceCommit: Schema.String.check(Schema.isPattern(/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/)),
  testedAgainst: Schema.Array(ContentVersion).check(Schema.isMaxLength(64)),
  publishedAt: Timestamp
};
function validVersionBounds(value) {
  if (value.maxVoyagerVersionExclusive === undefined)
    return true;
  const precedence = compare(value.minVoyagerVersion, value.maxVoyagerVersionExclusive);
  if (precedence !== 0)
    return precedence < 0;
  const hotfix = /^\d+\.\d+\.\d+(?:\+[1-9]\d*)?$/;
  return hotfix.test(value.minVoyagerVersion) && hotfix.test(value.maxVoyagerVersionExclusive) && compareBuild(value.minVoyagerVersion, value.maxVoyagerVersionExclusive) < 0;
}
var SkillRevision = Schema.Struct({
  ...RevisionFields,
  kind: Schema.Literal("skill"),
  id: SkillId,
  payload: Schema.Struct({
    ...ContentPayload.fields,
    mediaType: Schema.Literal("application/json")
  })
}).check(Schema.makeFilter(validVersionBounds));
var TechniqueRevision = Schema.Struct({
  ...RevisionFields,
  kind: Schema.Literal("technique"),
  id: TechniqueId,
  payload: Schema.Struct({ ...ContentPayload.fields, mediaType: Schema.Literal("text/markdown") }),
  tags: Schema.Array(text(128).check(Schema.isPattern(/^(makes|for|tool):[a-z0-9-]+$/))).check(Schema.isMaxLength(64)),
  slug: Slug,
  sourceUrl: HttpsUrl,
  cardTitle: text(256),
  starterText: text(4096),
  media: Schema.Struct({
    poster: ContentMedia.check(Schema.makeFilter((value) => value.mediaType.startsWith("image/"))),
    preview: Schema.optional(ContentMedia.check(Schema.makeFilter((value) => value.mediaType.startsWith("video/")))),
    video: Schema.optional(ContentMedia.check(Schema.makeFilter((value) => value.mediaType.startsWith("video/"))))
  }),
  assets: Schema.Array(ContentMedia).check(Schema.isMaxLength(128))
}).check(Schema.makeFilter(validVersionBounds));
var ContentRevision = Schema.Union([SkillRevision, TechniqueRevision]);
var ReleaseMembership = Schema.Struct({
  nightlyPublishedAt: Schema.optional(Timestamp),
  id: ContentId,
  revision: PositiveInteger,
  channels: Schema.Array(ContentChannel).check(Schema.isMinLength(1), Schema.isMaxLength(2), Schema.makeFilter((values) => new Set(values).size === values.length))
});
var ContentRevocation = Schema.Struct({
  id: ContentId,
  revision: PositiveInteger,
  reason: text(1024),
  revokedAt: Timestamp
});
var ContentCatalog = Schema.Struct({
  schemaVersion: Schema.Literal(1),
  catalogSequence: PositiveInteger,
  publishedAt: Timestamp,
  expiresAt: Timestamp,
  entries: Schema.Array(ContentRevision).check(Schema.isMaxLength(CONTENT_CATALOG_LIMITS.entries)),
  releases: Schema.Array(ReleaseMembership).check(Schema.isMaxLength(CONTENT_CATALOG_LIMITS.entries)),
  revoked: Schema.Array(ContentRevocation).check(Schema.isMaxLength(CONTENT_CATALOG_LIMITS.entries))
}).check(Schema.makeFilter((catalog) => {
  const key = (value) => `${value.id}@${value.revision}`;
  const entries = new Set(catalog.entries.map(key));
  return Date.parse(catalog.expiresAt) > Date.parse(catalog.publishedAt) && entries.size === catalog.entries.length && new Set(catalog.releases.map(key)).size === catalog.releases.length && new Set(catalog.revoked.map(key)).size === catalog.revoked.length && catalog.releases.every((release) => entries.has(key(release))) && new Set([...catalog.entries, ...catalog.releases, ...catalog.revoked].map((entry) => entry.id.split("/")[0])).size <= 1;
}));
var ContentSkillPackage = Schema.Struct({
  schemaVersion: Schema.Literal(1),
  files: Schema.Array(Schema.Struct({
    path: ContentTargetPath,
    content: Schema.String.check(Schema.isMaxLength(CONTENT_CATALOG_LIMITS.skillFileBytes), Schema.makeFilter((value) => new TextEncoder().encode(value).length <= CONTENT_CATALOG_LIMITS.skillFileBytes))
  })).check(Schema.isMinLength(1), Schema.isMaxLength(CONTENT_CATALOG_LIMITS.skillFiles))
}).check(Schema.makeFilter((value) => value.files.some((file) => file.path === "SKILL.md") && new Set(value.files.map((file) => file.path.toLowerCase())).size === value.files.length && value.files.every((file) => !value.files.some((other) => other.path.toLowerCase().startsWith(`${file.path.toLowerCase()}/`))) && value.files.reduce((total, file) => total + new TextEncoder().encode(file.content).length, 0) <= CONTENT_CATALOG_LIMITS.skillTotalBytes));
export {
  TechniqueRevision,
  SkillRevision,
  ReleaseMembership,
  ContentVersion,
  ContentTargetPath,
  ContentSkillPackage,
  ContentRevocation,
  ContentRevision,
  ContentReference,
  ContentPayload,
  ContentMediaUrl,
  ContentMedia,
  ContentId,
  ContentDependency,
  ContentChannel,
  ContentCatalog,
  CONTENT_CATALOG_LIMITS
};
