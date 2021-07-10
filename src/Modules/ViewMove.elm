module ViewMove exposing (deltaX, deltaY)

{-| This let the camera move with the player
 

# view

@docs deltaX, deltaY

-}

import GlobalBasics
import Player


{-| Units when using their own view, need to add this delta to their unit to make sure the camera moves. You can use
it like this. For example in Brick module:

    [ Svg.rect
        [ SvgAttr.x (String.fromFloat (ViewMove.deltaX model + brickX))
        ...
        ]
    ]

-}
deltaX : { model | windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player } -> Float
deltaX model =
    let
        windowBoundaryX =
            model.windowBoundary
                |> Tuple.first

        levelBoundaryX =
            model.levelBoundary
                |> Tuple.first

        playerX =
            model.player.pos
                |> Tuple.first
    in
    if levelBoundaryX < windowBoundaryX then
        0.0

    else if playerX < windowBoundaryX / 2.0 then
        0.0

    else if playerX + windowBoundaryX / 2.0 > levelBoundaryX then
        windowBoundaryX - levelBoundaryX

    else
        windowBoundaryX / 2.0 - playerX


{-| Units when using their own view, need to add this delta to their unit to make sure the camera moves. You can use
it like this. For example in Brick module:

    [ Svg.rect
        [ SvgAttr.y (String.fromFloat (ViewMove.deltaY model + brickY))
        ...
        ]
    ]

-}
deltaY : { model | windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player } -> Float
deltaY model =
    let
        windowBoundaryY =
            model.windowBoundary
                |> Tuple.second

        levelBoundaryY =
            model.levelBoundary
                |> Tuple.second

        playerY =
            model.player.pos
                |> Tuple.second
    in
    if levelBoundaryY < windowBoundaryY then
        0.0

    else if playerY < windowBoundaryY / 2.0 then
        0.0

    else if playerY + windowBoundaryY / 2.0 > levelBoundaryY then
        windowBoundaryY - levelBoundaryY

    else
        windowBoundaryY / 2.0 - playerY
