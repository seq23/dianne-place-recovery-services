# Licensure Mode Switch

The owner may switch from `pre_license` to `licensed_provider` only when:

- license status is active
- license number, type, issuing agency, effective date, state, and covered services are entered
- supporting documentation is referenced
- legal pages are reviewed
- `validate:licensure-mode` passes

The switch changes public copy, legal disclaimers, service language, schema, content validators, and LLM files.

It does not automatically enable PHI collection, insurance verification, third-party tracking, accreditation badges, or unsupported service claims.
