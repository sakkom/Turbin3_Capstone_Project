use anchor_lang::error_code;

#[error_code]
pub enum UserError {
    #[msg("Name must be between 1 and 32 characters")]
    NameTooLong,
    #[msg("Role numbers must be 0, 1 and 2")]
    InvalidRole,
    #[msg("Unauthorized role")]
    UnauthorizedRole,
    #[msg("Invalid artist")]
    InvalidArtist,
}

#[error_code]
pub enum WallError {
    #[msg("Not space available")]
    NoSpaceAvailable,
    #[msg("Unexpected status")]
    UnexpectedStatus,
    #[msg("Wall already has an arrpvoed proposal")]
    ProposalExsits,
}

#[error_code]
pub enum ExpensesError {
    #[msg("The deposit amount must meet the offer_price")]
    InsufficientDeposit,
    #[msg("insufficient token amount")]
    InsufficientTokenBalance,
}

#[error_code]
pub enum MultisigError {
    #[msg("Invalid multisig signers")]
    InvalidMultisigSigners,
    #[msg("not enought signers")]
    NotEnoughtSigners,
    #[msg("already signed")]
    AlreadySigned,
    #[msg("UnauthorizedSigner")]
    UnauthorizedSigner,
    #[msg("multisig not cancel bool")]
    NotCancelBool,
}
