import Array exposing (Array)
import GlobalBasics
import MainType
import Maybe exposing (withDefault)
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr


{-| `PlayerJump` defines the statuses of the jump. PLayerJump (jumpNum : Int) (jumpFrame : Int). jumpNum : how many
times left can the player jump. jumpFrame : what frame is this jump if it's happening, -1 represents not jumping now
and last jump has keyUp, -2 represents jump has keyDown but last jump hasn't release.
-}
type PlayerJump
    = Jump Int Int


{-| Definition of player, `pos` is current position, `lastPos` store the last position, used in collision test,
`velocity` is its velocity, divided into x-axis and y-axis. `collisionBox` is its `CollisionBox`, `jumpNum` is how
many times it can jump.
-}
type alias Player =
    { pos : GlobalBasics.Pos
    , lastPos : GlobalBasics.Pos
    , velocity : GlobalBasics.Pos
    , jump : PlayerJump
    , collisionBox : GlobalBasics.CollisionBox
    , ifChangeBackToLastPos : Bool
    }


{-| Constant width of player object
-}
playerWidth : Float
playerWidth =
    20.0


{-| Constant height of player object
-}
playerHeight : Float
playerHeight =
    20.0


{-| Constant of how many times player can jump
-}
playerJumpNum : Int
playerJumpNum =
    2


{-| Constant of how many frames can one jump lasts
-}
playerJumpFrames : Int
playerJumpFrames =
    20


{-| Constant of how many will the player accelerate after the first time the jump is pressed.
-}
playerJumpInitialAcce : Float
playerJumpInitialAcce =
    0.6


{-| Constant of how fast will the player object move when left or right is pressed.
-}
playerHorizontalSpeed : Float
playerHorizontalSpeed =
    2.0


{-| Constant of initial speed of jump.
-}
playerInitialJumpSpeed : Float
playerInitialJumpSpeed =
    -1.0


{-| Constant of the gravity.
-}
gravityAcce : Float
gravityAcce =
    0.1


{-| When the jumps takes place in fameNum, return the corresponding acceleration.
-}
playerJumpAcce : Int -> Float
playerJumpAcce frameNum =
    let
        totalFrame =
            toFloat playerJumpFrames

        nowFrame =
            toFloat frameNum

        acce =
            nowFrame / totalFrame * playerJumpInitialAcce
    in
    acce

